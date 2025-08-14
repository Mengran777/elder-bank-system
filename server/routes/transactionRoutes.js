import express from "express";
import {
  getTransactions,
  createTransfer,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js"; // <--- 🌟 确保路径和文件名正确无误

const router = express.Router();

// 交易记录获取
router.route("/").get(protect, getTransactions); // 获取用户交易记录

// 转账操作
router.route("/transfer").post(protect, createTransfer); // 执行转账

export default router;
