import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    获取用户资料
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

  // 1. 验证当前密码是否正确
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401).json({ message: "Current password is incorrect" });
    return;
  }

  // 2. 验证新密码是否符合要求
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

  // 关键：将明文新密码赋值给 user.password
  user.password = newPassword;

  // ✨ 新增调试日志：在保存前检查 password 字段是否被 Mongoose 标记为修改
  console.log(
    'Controller: user.isModified("password") before save:',
    user.isModified("password")
  );

  try {
    // 3. 保存用户，这将触发 pre('save') 钩子来哈希密码
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
