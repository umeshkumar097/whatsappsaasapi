import fs from 'fs';

const file = 'server/services/whatsapp-api.ts';
let code = fs.readFileSync(file, 'utf8');

// Remove dynamic imports
code = code.replace("const { db } = await import('@shared/db');", "");
code = code.replace("const { wallets, walletTransactions, messageRates } = await import('@shared/schema');", "");
code = code.replace("const { eq } = await import('drizzle-orm');", "");

// Add static imports at the top
const importsToAdd = `
import { db } from "@shared/db";
import { wallets, walletTransactions, messageRates } from "@shared/schema";
import { eq } from "drizzle-orm";
`;

if (!code.includes('import { db } from "@shared/db"')) {
    code = code.replace(
      'import type { Channel } from "@shared/schema";',
      'import type { Channel } from "@shared/schema";' + importsToAdd
    );
}

fs.writeFileSync(file, code);
console.log("Fixed dynamic imports in whatsapp-api.ts");
