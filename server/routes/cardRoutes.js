import express from "express";
import {
  getCards,
  addCard,
  deleteCard,
} from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 所有银行卡相关的路由都受保护
router
  .route("/")
  .get(protect, getCards) // 获取用户所有银行卡
  .post(protect, addCard); // 添加新银行卡

router.route("/:id").delete(protect, deleteCard); // 删除银行卡

export default router;
