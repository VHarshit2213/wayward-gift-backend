import express from "express";
import * as ctrl from "../controllers/transaction.controller.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();
router.use(authenticate);
// Admin views
router.get("/admin/", ctrl.listTransactionsAdmin);
router.get("/admin/:id", ctrl.getTransactionAdmin);

// User views
router.get("/user", ctrl.listUserTransactions);
router.get("/user/:id", ctrl.getTransactionById);

export default router;