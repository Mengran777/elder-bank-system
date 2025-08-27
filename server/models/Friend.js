import mongoose from "mongoose";

const friendSchema = mongoose.Schema(
  {
    user: {
      // 关联到用户ID，表明这个朋友列表属于哪个用户
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    friendUser: {
      // 关联到朋友的用户ID (如果朋友也是本系统用户)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // 朋友不一定是本系统用户，因此不强制关联
    },
    name: {
      // 朋友的显示名称
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      // 朋友的银行账号
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      // 朋友的银行代码 (Sort Code)
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;
