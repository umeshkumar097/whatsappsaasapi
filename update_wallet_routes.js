import fs from 'fs';

const file = 'server/routes/wallet.routes.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('/api/wallet/verify-funds')) {
  code = code.replace(
    'app.post("/api/wallet/add-funds", requireAuth, walletController.addFunds);',
    'app.post("/api/wallet/add-funds", requireAuth, walletController.addFunds);\n  app.post("/api/wallet/verify-funds", requireAuth, walletController.verifyFunds);'
  );
  fs.writeFileSync(file, code);
  console.log("Updated routes");
}
