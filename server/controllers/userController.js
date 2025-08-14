import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    获取用户资料
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user 由 authMiddleware 提供，包含已认证的用户信息
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

// @desc    更新用户密码
// @route   PUT /api/users/profile/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // 验证当前密码
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401).json({ message: "Current password is incorrect" });
    return;
  }

  // 验证新密码是否符合要求
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
    res
      .status(400)
      .json({
        message: "New password cannot be the same as the current password",
      });
    return;
  }

  // 更新密码
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

export { getUserProfile, updateUserPassword };
