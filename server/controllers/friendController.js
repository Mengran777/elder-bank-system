import Friend from "../models/Friend.js"; // 导入 Friend 模型
import User from "../models/User.js"; // 导入 User 模型，用于查找朋友是否为本系统用户
import mongoose from "mongoose"; // 导入 mongoose 用于识别 ValidationError

// @desc    获取所有用户的朋友列表
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    // 查找当前用户添加的所有朋友文档，并按名称排序
    const friends = await Friend.find({ user: req.user._id }).sort({ name: 1 });
    res.json(friends);
  } catch (error) {
    console.error("Error in getFriends:", error);
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

// @desc    添加新朋友
// @route   POST /api/friends
// @access  Private
const addFriend = async (req, res) => {
  // 从前端接收朋友的姓名、账号和银行代码
  const { name, accountNumber, shortCode } = req.body;
  const currentUserId = req.user._id;

  // 基本验证：确保所有必填字段都已提供
  if (!name || !accountNumber || !shortCode) {
    res.status(400).json({
      message: "Please provide friend's name, account number, and short code.",
    });
    return;
  }

  try {
    // 检查当前用户是否已添加了具有相同账号和银行代码的朋友
    const friendExists = await Friend.findOne({
      user: currentUserId,
      accountNumber,
      shortCode,
    });

    if (friendExists) {
      res.status(400).json({
        message:
          "Friend with this account number and short code already exists for you.",
      });
      return;
    }

    // 可选：检查该朋友是否是本系统的注册用户
    // 假设 User 模型的 accountId 字段对应银行账号
    const existingUser = await User.findOne({ accountId: accountNumber });

    // 创建一个新的 Friend 文档
    const friend = await Friend.create({
      user: currentUserId,
      friendUser: existingUser ? existingUser._id : null, // 如果找到对应的用户，则关联其 ID
      name,
      accountNumber,
      shortCode,
    });

    res.status(201).json({
      _id: friend._id,
      name: friend.name,
      accountNumber: friend.accountNumber,
      shortCode: friend.shortCode,
      message: "Friend added successfully!",
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    // 专门处理 Mongoose 验证错误
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to add friend." });
    }
  }
};

// @desc    删除朋友
// @route   DELETE /api/friends/:id
// @access  Private
const deleteFriend = async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.id);

    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    // 确保只有朋友列表的拥有者才能删除该朋友记录
    if (friend.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: "Not authorized to delete this friend" });
      return;
    }

    await friend.deleteOne(); // 删除朋友文档
    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete friend." });
  }
};

export { getFriends, addFriend, deleteFriend };
