import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
    },
    accountId: {
      // 假设这是唯一的账户ID
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// 在保存用户之前对密码进行哈希处理
userSchema.pre("save", async function (next) {
  console.log("User pre-save hook triggered."); // 调试日志：钩子触发
  console.log("Is password modified?", this.isModified("password")); // 调试日志：检查密码是否被修改

  // 只有当密码字段被修改时才进行哈希
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hash."); // 调试日志：密码未修改
    return next(); // 如果密码未修改，直接调用 next() 并返回
  }

  // 密码被修改，执行哈希
  console.log("Password modified, hashing now."); // 调试日志：密码已修改，开始哈希
  // ⚠️ 警告：在生产环境中，请勿打印或记录明文密码或其直接哈希值！
  // console.log('Password BEFORE hash (should be plaintext from controller):', this.password);

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // ⚠️ 警告：在生产环境中，请勿打印或记录明文密码或其直接哈希值！
  // console.log('Password AFTER hash:', this.password);
  console.log("Password hashed successfully."); // 调试日志：哈希完成
  next(); // 在哈希完成后调用 next()，确保保存流程继续
});

// 验证用户输入的密码是否正确
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Matching password..."); // 调试日志：匹配密码触发
  // ⚠️ 警告：在生产环境中，请勿打印或记录明文密码或其直接哈希值！
  console.log("Entered password for comparison:", enteredPassword);
  console.log("Stored password hash in DB for comparison:", this.password);

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log("Password comparison result (isMatch):", isMatch); // 调试日志：显示比较结果
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export default User;
