import { Application } from "express";
import * as walletController from "../controllers/wallet.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

export function setupWalletRoutes(app: Application) {
  app.get("/api/wallet", requireAuth, walletController.getWallet);
  app.get("/api/wallet/transactions", requireAuth, walletController.getTransactions);
  app.post("/api/wallet/add-funds", requireAuth, walletController.addFunds);
  app.post("/api/wallet/verify-funds", requireAuth, walletController.verifyFunds);
  app.get("/api/rates", requireAuth, walletController.getRates);
  app.get("/api/admin/wallets/transactions", requireAuth, requireRole("superadmin"), walletController.getAllTransactions);
  app.post("/api/admin/rates", requireAuth, requireRole("superadmin"), walletController.setRates);
}
