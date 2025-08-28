import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js"; // ✨ 修正：移除 deleteFriend 的导入
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to add a new friend
router.post("/", protect, addFriend);

// Route to get current user's friends list
router.get("/", protect, getFriends);

// 如果您打算未来实现删除朋友的功能，您需要在 friendController.js 中定义 deleteFriend 函数，
// 然后在这里导入并添加相应的路由，例如：
// router.delete('/:id', protect, deleteFriend);

export default router;
