import User from "../models/User.js";
import mongoose from "mongoose"; // For potential ObjectId validation, though Mongoose handles cast errors

// @desc    Add a friend to the current user's friends list
// @route   POST /api/friends
// @access  Private
const addFriend = async (req, res) => {
  // friendIdentifier will be the recipient's accountId from the frontend form
  const { friendIdentifier, name, accountNumber, shortCode } = req.body; // Added name, accountNumber, shortCode for future use if storing friend's specific details on current user's document
  const currentUserId = req.user._id;

  if (!friendIdentifier) {
    res
      .status(400)
      .json({ message: "Please provide the Account ID of the friend to add." });
    return;
  }

  try {
    // Find the potential friend by their accountId
    const friendToAdd = await User.findOne({ accountId: friendIdentifier });

    if (!friendToAdd) {
      res
        .status(404)
        .json({
          message: `User with Account ID ${friendIdentifier} not found.`,
        });
      return;
    }

    // Prevent adding self
    if (friendToAdd._id.toString() === currentUserId.toString()) {
      res.status(400).json({ message: "You cannot add yourself as a friend." });
      return;
    }

    // Find the current user
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      // This should ideally not happen if authMiddleware is working correctly
      res.status(404).json({ message: "Current user not found." });
      return;
    }

    // Check if already friends
    if (currentUser.friends.includes(friendToAdd._id)) {
      res
        .status(400)
        .json({ message: "You are already friends with this user." });
      return;
    }

    // Add friend's ObjectId to current user's friends list
    currentUser.friends.push(friendToAdd._id);
    await currentUser.save();

    // Optionally: Add current user to friendToAdd's list (for bidirectional friendship)
    // This part assumes the friend also wants to be friends. For this demo, we can just make it unilateral.
    // If you want bidirectional, you'd need a way to notify the other user or automatically add.
    // For simplicity, we'll keep it unilateral for now unless specifically requested.

    res.status(200).json({
      message: `${friendToAdd.accountName} (${friendToAdd.accountId}) added as a friend!`,
      // Return the newly added friend's info (from their User model) to refresh frontend
      friend: {
        _id: friendToAdd._id,
        name: friendToAdd.accountName, // Assuming accountName is the display name
        accountNumber: friendToAdd.accountId, // Assuming accountId is the accountNumber for friend transfers
        shortCode: friendToAdd.shortCode || "N/A", // If User model had shortCode, retrieve it. Otherwise, N/A or user input.
      },
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Server error while adding friend." });
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
    const friendList = currentUser.friends.map((friend) => ({
      _id: friend._id,
      name: friend.accountName,
      accountNumber: friend.accountId,
      // Note: shortCode is not directly on the User model currently.
      // If you need it, you'd either add it to the User model,
      // or fetch it from one of their associated Card documents (more complex).
      // For now, assume it's collected on the frontend if needed for transfer.
    }));

    res.status(200).json(friendList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Server error while fetching friends." });
  }
};

export { addFriend, getFriends };
