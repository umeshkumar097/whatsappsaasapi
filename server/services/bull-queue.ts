import { Queue, Worker, Job, QueueEvents } from "bullmq";
import { isRedisAvailable, getRedisClient } from "./redis";
import { db } from "../db";
import { messageQueue, channels, campaigns } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { WhatsAppApiService } from "./whatsapp-api";
import { cacheGet, CACHE_KEYS, CACHE_TTL } from "./cache";

const QUEUE_NAME = "whatsapp-messages";

let messageQueueBull: Queue | null = null;
let messageWorker: Worker | null = null;
let queueEvents: QueueEvents | null = null;

function getRedisConnection() {
  const client = getRedisClient();
  if (!client) return null;
  return {
    host: (client.options as any)?.host || "127.0.0.1",
    port: (client.options as any)?.port || 6379,
    password: (client.options as any)?.password,
    db: (client.options as any)?.db || 0,
  };
}

function getConnectionFromUrl(): Record<string, any> | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  try {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || "6379", 10),
      password: url.password || undefined,
      db: url.pathname ? parseInt(url.pathname.slice(1) || "0", 10) : 0,
    };
  } catch {
    return null;
  }
}

export function isBullQueueAvailable(): boolean {
  return messageQueueBull !== null && isRedisAvailable();
}

export function getBullQueue(): Queue | null {
  return messageQueueBull;
}

export async function initBullQueue(): Promise<boolean> {
  if (!isRedisAvailable()) {
    console.log("[BullMQ] Redis not available — using DB polling fallback");
    return false;
  }

  const connection = getConnectionFromUrl() || getRedisConnection();
  if (!connection) {
    console.log("[BullMQ] Could not determine Redis connection — using DB polling fallback");
    return false;
  }

  try {
    messageQueueBull = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: parseInt(process.env.MESSAGE_QUEUE_MAX_ATTEMPTS || "3", 10),
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    });

    messageWorker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        await processMessageJob(job);
      },
      {
        connection,
        concurrency: parseInt(process.env.BULLMQ_CONCURRENCY || "10", 10),
        limiter: {
          max: parseInt(process.env.BULLMQ_RATE_MAX || "50", 10),
          duration: parseInt(process.env.BULLMQ_RATE_DURATION || "1000", 10),
        },
      }
    );

    messageWorker.on("completed", (job: Job) => {
      console.log(`[BullMQ] Job ${job.id} completed`);
    });

    messageWorker.on("failed", (job: Job | undefined, err: Error) => {
      console.error(`[BullMQ] Job ${job?.id} failed:`, err.message);
    });

    messageWorker.on("error", (err: Error) => {
      console.error("[BullMQ] Worker error:", err.message);
    });

    queueEvents = new QueueEvents(QUEUE_NAME, { connection });

    console.log("[BullMQ] Queue and worker initialized successfully");
    return true;
  } catch (err: any) {
    console.error("[BullMQ] Failed to initialize:", err.message);
    messageQueueBull = null;
    messageWorker = null;
    queueEvents = null;
    return false;
  }
}

export async function processMessageJob(job: Job) {
  const { messageId, channelId, recipientPhone, templateName, templateParams, messageType, campaignId, baseAttempts: rawBaseAttempts } = job.data;
  // GLOBAL attempt accounting across DB-polling ↔ BullMQ engine switches.
  //
  // baseAttempts = attempts already consumed by the DB-polling engine before
  // this job was migrated into BullMQ on Redis reconnect (0 for natively
  // enqueued jobs). currentAttempt = this Bull invocation (1-indexed).
  // globalAttempt is what we persist to message_queue.attempts so a later
  // engine switch back to DB polling sees the true cross-engine count.
  const baseAttempts = typeof rawBaseAttempts === "number" && rawBaseAttempts > 0 ? rawBaseAttempts : 0;
  const currentAttempt = (job.attemptsMade || 0) + 1;
  const globalAttempt = baseAttempts + currentAttempt;
  // Bull's per-job cap (set by reconciliation to remaining budget) bounds
  // currentAttempt; the global cap below ensures combined ≤ MAX_ATTEMPTS.
  const GLOBAL_MAX_ATTEMPTS = parseInt(
    process.env.MESSAGE_QUEUE_MAX_ATTEMPTS || "3",
    10
  );

  try {
    await db
      .update(messageQueue)
      .set({ status: "processing", processedAt: new Date() })
      .where(eq(messageQueue.id, messageId));

    let channel = await cacheGet(
      CACHE_KEYS.channel(channelId),
      CACHE_TTL.channel,
      async () => {
        const [ch] = await db
          .select()
          .from(channels)
          .where(eq(channels.id, channelId))
          .limit(1);
        return ch || null;
      }
    );

    if (!channel) {
      throw new Error(`Channel not found: ${channelId}`);
    }

    if (campaignId) {
      const [camp] = await db
        .select({ status: campaigns.status })
        .from(campaigns)
        .where(eq(campaigns.id, campaignId))
        .limit(1);
      if (camp?.status === "paused") {
        // Leave the row in `queued` state with no future scheduledFor so it
        // sits idle until the campaign is resumed. The resume path picks it
        // back up; the paused-too-long sweeper in the scheduled-campaigns
        // cron eventually fails it if the campaign stays paused indefinitely.
        await db
          .update(messageQueue)
          .set({ status: "queued", scheduledFor: null })
          .where(eq(messageQueue.id, messageId));
        console.log(`[BullMQ] Campaign ${campaignId} is paused — leaving message ${messageId} idle in queued state`);
        return;
      }
    }

    const canSend = await WhatsAppApiService.checkRateLimit(channel.id);
    if (!canSend) {
      // Don't reset DB status to "queued" — that risks double-pickup if
      // DB-polling ever runs alongside. Let BullMQ's exponential backoff
      // handle the retry; status stays "processing" until the next attempt.
      throw new Error("Rate limited — will retry");
    }

    const isMarketing = messageType === "marketing";

    let response;
    if (templateName) {
      response = await WhatsAppApiService.sendTemplateMessage(
        channel,
        recipientPhone,
        templateName,
        templateParams || [],
        "en_US",
        isMarketing
      );
    } else {
      throw new Error("Non-template messages not yet implemented");
    }

    await db
      .update(messageQueue)
      .set({
        status: "sent",
        whatsappMessageId: response.messages?.[0]?.id,
        sentVia: isMarketing ? "marketing_messages" : "cloud_api",
        attempts: globalAttempt,
      })
      .where(eq(messageQueue.id, messageId));

    if (campaignId) {
      await db
        .update(campaigns)
        .set({ sentCount: sql`${campaigns.sentCount} + 1` })
        .where(eq(campaigns.id, campaignId));
    }

    console.log(`[BullMQ] Message sent: ${messageId}`);
  } catch (error) {
    console.error(`[BullMQ] Failed to send message ${messageId}:`, error);

    // Final when either Bull's per-job cap is hit OR the global combined
    // attempt count reaches the system-wide max. Both bounds protect the
    // SLA across DB-polling ↔ BullMQ engine transitions.
    const bullMaxAttempts = job.opts?.attempts ?? GLOBAL_MAX_ATTEMPTS;
    const isFinalAttempt =
      currentAttempt >= bullMaxAttempts ||
      globalAttempt >= GLOBAL_MAX_ATTEMPTS;
    await db
      .update(messageQueue)
      .set({
        // Mirror BullMQ's lifecycle: stays "processing" between retries (BullMQ
        // owns the schedule); flip to "failed" only when no more retries remain.
        status: isFinalAttempt ? "failed" : "processing",
        attempts: globalAttempt,
        errorCode: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      .where(eq(messageQueue.id, messageId));

    if (campaignId && isFinalAttempt) {
      await db
        .update(campaigns)
        .set({ failedCount: sql`${campaigns.failedCount} + 1` })
        .where(eq(campaigns.id, campaignId));
    }

    throw error;
  }
}

export async function addMessageToBullQueue(messageData: {
  messageId: string;
  channelId: string;
  recipientPhone: string;
  templateName: string;
  templateParams?: any[];
  messageType: string;
  campaignId?: string;
  attempts?: number;
  /** Attempts already consumed by the DB-polling engine before reconciliation */
  baseAttempts?: number;
  scheduledFor?: Date;
}): Promise<boolean> {
  if (!messageQueueBull) return false;

  try {
    const jobOptions: any = {};

    if (messageData.scheduledFor) {
      const delay = messageData.scheduledFor.getTime() - Date.now();
      if (delay > 0) {
        jobOptions.delay = delay;
      }
    }
    // Use messageId as the BullMQ jobId so re-enqueues of the same DB row
    // (e.g. during Redis-reconnect reconciliation) become no-ops instead
    // of producing duplicate jobs.
    jobOptions.jobId = messageData.messageId;

    // Allow callers (e.g. reconciliation after Redis reconnect) to cap the
    // total number of attempts BullMQ will make for this job, so messages
    // already attempted in DB-polling mode cannot exceed the configured
    // maximum across both engines combined.
    if (typeof messageData.attempts === "number" && messageData.attempts > 0) {
      jobOptions.attempts = messageData.attempts;
    }

    await messageQueueBull.add("send-message", messageData, jobOptions);
    return true;
  } catch (err: any) {
    console.error("[BullMQ] Failed to add job:", err.message);
    return false;
  }
}

export async function addBulkMessagesToBullQueue(
  messages: Array<{
    messageId: string;
    channelId: string;
    recipientPhone: string;
    templateName: string;
    templateParams?: any[];
    messageType: string;
    campaignId?: string;
    scheduledFor?: Date;
  }>
): Promise<number> {
  if (!messageQueueBull) return 0;

  try {
    const jobs = messages.map((msg) => {
      const jobOptions: any = {};
      if (msg.scheduledFor) {
        const delay = msg.scheduledFor.getTime() - Date.now();
        if (delay > 0) {
          jobOptions.delay = delay;
        }
      }
      // jobId = messageId so reconciliation re-enqueues are idempotent.
      jobOptions.jobId = msg.messageId;
      return {
        name: "send-message",
        data: msg,
        opts: jobOptions,
      };
    });

    await messageQueueBull.addBulk(jobs);
    return messages.length;
  } catch (err: any) {
    console.error("[BullMQ] Failed to add bulk jobs:", err.message);
    return 0;
  }
}

export async function getBullQueueStats(): Promise<Record<string, number> | null> {
  if (!messageQueueBull) return null;

  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      messageQueueBull.getWaitingCount(),
      messageQueueBull.getActiveCount(),
      messageQueueBull.getCompletedCount(),
      messageQueueBull.getFailedCount(),
      messageQueueBull.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  } catch {
    return null;
  }
}

export async function shutdownBullQueue(): Promise<void> {
  try {
    if (messageWorker) {
      await messageWorker.close();
      messageWorker = null;
    }
    if (queueEvents) {
      await queueEvents.close();
      queueEvents = null;
    }
    if (messageQueueBull) {
      await messageQueueBull.close();
      messageQueueBull = null;
    }
    console.log("[BullMQ] Queue shut down gracefully");
  } catch (err: any) {
    console.error("[BullMQ] Error during shutdown:", err.message);
  }
}
