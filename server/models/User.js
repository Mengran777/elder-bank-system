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
    // ✨ 新增：朋友列表字段
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // 引用 User 模型本身
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 在保存用户之前对密码进行哈希处理
userSchema.pre("save", async function (next) {
  // 只有当密码字段被修改时才进行哈希
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 验证用户输入的密码是否正确
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User; // 确保这里有默认导出
