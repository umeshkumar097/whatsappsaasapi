import type { Express } from "express";
import * as metaAgentController from "../controllers/meta-agent.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { extractChannelId } from "../middlewares/channel.middleware";

export function registerMetaAgentRoutes(app: Express) {
  // Onboard / Enable / Disable
  app.post("/api/meta-agent/onboard", requireAuth, metaAgentController.onboardAgent);

  // Settings
  app.get("/api/meta-agent/settings", requireAuth, metaAgentController.getSettings);
  app.post("/api/meta-agent/settings", requireAuth, metaAgentController.updateSettings);

  // Knowledge Files
  app.get("/api/meta-agent/files", requireAuth, metaAgentController.getFiles);
  app.post("/api/meta-agent/files", requireAuth, upload.single("file"), metaAgentController.uploadFile);
  app.delete("/api/meta-agent/files/:fileId", requireAuth, metaAgentController.deleteFile);

  // FAQs
  app.get("/api/meta-agent/faqs", requireAuth, metaAgentController.getFaqs);
  app.post("/api/meta-agent/faqs", requireAuth, metaAgentController.createFaq);
  app.delete("/api/meta-agent/faqs/:faqId", requireAuth, metaAgentController.deleteFaq);
}
