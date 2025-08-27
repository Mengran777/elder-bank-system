import express from "express";
import {
  getFriends,
  addFriend,
  deleteFriend,
} from "../controllers/friendController.js"; // 导入 deleteFriend
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 所有朋友相关的路由都受保护
router
  .route("/")
  .get(protect, getFriends) // 获取用户所有朋友列表
  .post(protect, addFriend); // 添加新朋友

router
  .route("/:id") // 针对特定朋友 ID 的路由
  .delete(protect, deleteFriend); // 删除朋友

export default router;
