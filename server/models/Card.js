import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
  {
    user: {
      // 关联到用户ID，表明这张卡属于哪个用户
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // 引用 User 模型
    },
    type: {
      // 卡片类型：debit, credit, others
      type: String,
      required: true,
      enum: ["debit", "credit", "others"], // 限制卡片类型
      default: "debit",
    },
    balance: {
      // 余额
      type: Number,
      required: true,
      default: 0,
    },
    holder: {
      // 持卡人姓名
      type: String,
      required: true,
    },
    number: {
      // 卡号（部分隐藏或加密存储）
      type: String,
      required: true,
      unique: true, // 卡号唯一
    },
    expires: {
      // 过期日期，格式 MM/YY
      type: String,
      required: true,
    },
    accountNumber: {
      // 关联账户号
      type: String,
      required: true,
    },
    shortCode: {
      // 银行代码
      type: String,
      required: true,
    },
    bank: {
      // 开户银行
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
