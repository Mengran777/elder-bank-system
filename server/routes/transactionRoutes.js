import express from "express";
import {
  getTransactions,
  createTransfer,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 获取所有交易记录 (需要认证)
router.route("/").get(protect, getTransactions);

// 创建转账 (需要认证)
router.route("/transfer").post(protect, createTransfer);

export default router;
