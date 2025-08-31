import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      accountName: user.accountName,
      accountId: user.accountId,
      email: user.email,
      phone: user.phone,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Verify current password
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401).json({ message: "Current password is incorrect" });
    return;
  }

  // Validate new password
  if (newPassword.length < 10) {
    res
      .status(400)
      .json({ message: "New password must be at least 10 characters long" });
    return;
  }
  if (newPassword !== confirmNewPassword) {
    res.status(400).json({ message: "New passwords do not match" });
    return;
  }
  if (currentPassword === newPassword) {
    res.status(400).json({
      message: "New password cannot be the same as the current password",
    });
    return;
  }

  // Assign plain new password to trigger hashing in pre('save') middleware
  user.password = newPassword;

  try {
    // Save user, pre('save') hook will hash the password
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error saving user after password update:", error);
    res
      .status(500)
      .json({ message: "Failed to update password due to a server error." });
  }
};

export { getUserProfile, updateUserPassword };
