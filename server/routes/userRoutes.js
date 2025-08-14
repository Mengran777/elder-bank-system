import express from "express";
import {
  getUserProfile,
  updateUserPassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 保护这些路由，只有登录用户才能访问
router.route("/profile").get(protect, getUserProfile);
router.route("/profile/password").put(protect, updateUserPassword);

export default router;
