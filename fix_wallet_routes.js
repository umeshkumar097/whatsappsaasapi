import fs from 'fs';

const file = 'server/routes/wallet.routes.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('requireRole')) {
  code = code.replace(
    'import { requireAuth } from "../middlewares/auth.middleware";',
    'import { requireAuth, requireRole } from "../middlewares/auth.middleware";'
  );
}

if (!code.includes('/api/admin/wallets/transactions')) {
  code = code.replace(
    '  app.get("/api/rates", requireAuth, walletController.getRates);\n}',
    '  app.get("/api/rates", requireAuth, walletController.getRates);\n  app.get("/api/admin/wallets/transactions", requireAuth, requireRole("superadmin"), walletController.getAllTransactions);\n  app.post("/api/admin/rates", requireAuth, requireRole("superadmin"), walletController.setRates);\n}'
  );
}

fs.writeFileSync(file, code);
