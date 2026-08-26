import fs from 'fs';

const file = 'server/controllers/wallet.controller.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace the bad getAllTransactions with a proper joined query
const badRegex = /export const getAllTransactions = asyncHandler\(async \(req: Request, res: Response\) => \{[\s\S]*?res\.json\(\{ success: true, transactions \}\);\n\}\);/;

const goodCode = `export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const allTxs = await db
    .select({
      transaction: walletTransactions,
      wallet: wallets,
      user: {
        id: users.id,
        username: users.username,
        email: users.email
      }
    })
    .from(walletTransactions)
    .innerJoin(wallets, eq(walletTransactions.walletId, wallets.id))
    .innerJoin(users, eq(wallets.userId, users.id))
    .orderBy(desc(walletTransactions.createdAt));

  res.json({ success: true, transactions: allTxs });
});`;

code = code.replace(badRegex, goodCode);

// Also need to import users and desc!
if (!code.includes('import { users }')) {
  code = code.replace(
    'import { wallets, walletTransactions, messageRates } from "../../shared/schema";',
    'import { wallets, walletTransactions, messageRates, users } from "../../shared/schema";'
  );
}

if (!code.includes('import { eq, desc }')) {
  code = code.replace(
    'import { eq } from "drizzle-orm";',
    'import { eq, desc } from "drizzle-orm";'
  );
}

fs.writeFileSync(file, code);
