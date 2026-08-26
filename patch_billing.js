import fs from 'fs';

const file = 'server/services/whatsapp-api.ts';
let code = fs.readFileSync(file, 'utf8');

const insertCheck = `
  async checkWalletAndDeduct(userId: string, category: string = "MARKETING"): Promise<void> {
    const { db } = await import('@shared/db');
    const { wallets, walletTransactions, messageRates } = await import('@shared/schema');
    const { eq } = await import('drizzle-orm');

    let rate = await db.query.messageRates.findFirst({ where: eq(messageRates.category, category) });
    const cost = rate ? parseFloat(rate.price) : 0.8;

    let wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
    if (!wallet) {
      throw new Error("Wallet not found. Please recharge to send messages.");
    }
    
    const balance = parseFloat(wallet.balance);
    if (balance < cost) {
      throw new Error("Insufficient wallet balance. Please recharge.");
    }

    const newBalance = (balance - cost).toFixed(4);
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));
    
    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      amount: (-cost).toString(),
      type: "DEBIT",
      description: \`WhatsApp \${category} Message\`
    });
  }
`;

code = code.replace(/export class WhatsAppApiService \{/, `export class WhatsAppApiService {\n${insertCheck}`);

// Find where template is fetched inside sendMessage
const templateRegex = /const templateLanguage = template\.language \|\| "en_US";/;
const templateHook = `const templateLanguage = template.language || "en_US";
    // [GUPSHUP BILLING BLOCK]
    if (this.channel.createdBy) {
      await this.checkWalletAndDeduct(this.channel.createdBy, template.category || "MARKETING");
    }
`;
code = code.replace(templateRegex, templateHook);

fs.writeFileSync(file, code);
console.log("Billing patched");
