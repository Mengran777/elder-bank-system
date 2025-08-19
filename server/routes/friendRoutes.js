import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to add a new friend
router.post("/", protect, addFriend);

// Route to get current user's friends list
router.get("/", protect, getFriends);

export default router;
