import fs from 'fs';

let walletRoutes = fs.readFileSync('server/routes/wallet.routes.ts', 'utf8');
walletRoutes = walletRoutes.replace(
  'import { requireAuth } from "../middleware/auth";',
  'import { requireAuth } from "../middlewares/auth.middleware";'
);
fs.writeFileSync('server/routes/wallet.routes.ts', walletRoutes);

let walletController = fs.readFileSync('server/controllers/wallet.controller.ts', 'utf8');
walletController = walletController.replace(
  'import { asyncHandler } from "../middleware/asyncHandler";',
  'import { asyncHandler } from "../middlewares/error.middleware";'
);
fs.writeFileSync('server/controllers/wallet.controller.ts', walletController);

console.log("Patched imports");
