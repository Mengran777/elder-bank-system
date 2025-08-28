import User from "../models/User.js";
import Card from "../models/Card.js"; // 导入 Card 模型以在获取朋友列表时关联银行卡信息
import mongoose from "mongoose"; // For potential ObjectId validation, though Mongoose handles cast errors

// @desc    Add a friend to the current user's friends list
// @route   POST /api/friends
// @access  Private
const addFriend = async (req, res) => {
  // ✨ 新增：在收到请求时打印 req.body，以调试前端发送的数据
  console.log("Backend received addFriend request with body:", req.body);

  // Frontend sends: { friendIdentifier: friend's_account_id, name: friend_name, shortCode: friend_short_code }
  const { friendIdentifier, name, shortCode } = req.body; // ✨ 修正：只解构前端发送的字段
  const currentUserId = req.user._id;

  // ✨ 新增：显式后端验证，匹配前端错误信息
  if (!friendIdentifier) {
    console.error("Validation Error: Missing friendIdentifier");
    return res
      .status(400)
      .json({ message: "Please provide friend's account ID." });
  }
  if (!name) {
    console.error("Validation Error: Missing name");
    return res.status(400).json({ message: "Please provide friend's name." });
  }
  if (!shortCode) {
    console.error("Validation Error: Missing shortCode");
    return res
      .status(400)
      .json({ message: "Please provide friend's short code." });
  }

  try {
    // Find the potential friend by their accountId (which is friendIdentifier from frontend)
    const friendToAdd = await User.findOne({ accountId: friendIdentifier });

    if (!friendToAdd) {
      console.error(
        "Backend: User with Account ID not found:",
        friendIdentifier
      );
      return res.status(404).json({
        message: `User with Account ID ${friendIdentifier} not found.`,
      });
    }

    // Prevent adding self
    if (friendToAdd._id.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    // Find the current user
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      // This should ideally not happen if authMiddleware is working correctly
      return res.status(404).json({ message: "Current user not found." });
    }

    // Check if already friends
    if (currentUser.friends.includes(friendToAdd._id)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }

    // Add friend's ObjectId to current user's friends list
    currentUser.friends.push(friendToAdd._id);
    await currentUser.save();

    res.status(200).json({
      message: `${name} (${friendIdentifier}) added as a friend!`,
      // Return the newly added friend's info (from their User model) to refresh frontend
      friend: {
        _id: friendToAdd._id,
        name: name, // Use the name provided by the current user for their friend list
        accountNumber: friendIdentifier, // Use the accountId (friendIdentifier) as accountNumber for display
        shortCode: shortCode, // Use the shortCode provided by the current user
      },
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding friend." });
  }
};

// @desc    Get current user's friends list
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    // Populate the 'friends' array, selecting specific fields
    const currentUser = await User.findById(req.user._id).populate(
      "friends",
      "accountName accountId" // Only retrieve these fields for the populated friends
    );

    if (!currentUser) {
      res.status(404).json({ message: "Current user not found." });
      return;
    }

    // Map the populated friends to a more suitable format for the frontend
    // 同时尝试查找朋友的默认卡片，以获取 shortCode (可选，如果需要)
    const friendListPromises = currentUser.friends.map(async (friend) => {
      // 查找朋友的任意一张卡片，以获取 shortCode。实际应用中可能需要选择默认卡或特定卡。
      const friendCard = await Card.findOne({ user: friend._id });

      return {
        _id: friend._id,
        name: friend.accountName,
        accountNumber: friend.accountId, // 朋友的 Account ID
        shortCode: friendCard ? friendCard.shortCode : "N/A", // 如果朋友有卡，则获取其 Short Code
      };
    });

    const friendList = await Promise.all(friendListPromises);

    res.status(200).json(friendList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Server error while fetching friends." });
  }
};

export { addFriend, getFriends };
