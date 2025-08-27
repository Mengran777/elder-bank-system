import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
  {
    user: {
      // 关联到用户ID，表明这张卡属于哪个用户
      type: mongoose.Schema.Types.ObjectId,
      required: true, // 用户关联仍然是必填的
      ref: "User", // 引用 User 模型
    },
    type: {
      // 卡片类型：debit, credit, others
      type: String,
      required: true, // 卡片类型仍然是必填的
      enum: ["debit", "credit", "others"], // 限制卡片类型
      default: "debit",
    },
    balance: {
      // 余额
      type: Number,
      required: true, // 余额仍然是必填的
      default: 0,
    },
    holder: {
      // 持卡人姓名
      type: String,
      required: true,
      trim: true, // ✨ 修改：添加 trim: true
    },
    number: {
      // 卡号
      type: String,
      required: true,
      unique: true, // 卡号必须唯一
      trim: true, // ✨ 修改：添加 trim: true
    },
    expires: {
      // 过期日期，格式 MM/YY
      type: String,
      required: true,
      trim: true, // ✨ 修改：添加 trim: true
    },
    accountNumber: {
      // 关联账户号
      type: String,
      required: true,
      trim: true, // ✨ 修改：添加 trim: true
    },
    shortCode: {
      // 银行代码
      type: String,
      required: true,
      trim: true, // ✨ 修改：添加 trim: true
    },
    bank: {
      // 开户银行
      type: String,
      required: true,
      trim: true, // ✨ 修改：添加 trim: true
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
