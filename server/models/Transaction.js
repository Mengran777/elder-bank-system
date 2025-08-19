import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    user: {
      // 关联到执行或接收此交易的用户
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    card: {
      // 关联到交易涉及的卡片 (例如：转出卡，或转入卡如果收款方是本行用户)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: false, // 并非所有交易都必须关联到特定卡片 (例如：外部转入)
    },
    type: {
      // 交易类型：'credit' (入账), 'debit' (出账)
      type: String,
      required: true,
      enum: ["credit", "debit"],
    },
    amount: {
      // 交易金额
      type: Number,
      required: true,
    },
    description: {
      // 交易描述 (例如：'转账到 John Doe', '从 Smith 收到')
      type: String,
      required: true,
    },
    // 转账相关字段
    senderAccount: {
      // 转出方账户号码
      type: String,
      required: true,
    },
    senderShortCode: {
      // 转出方银行代码
      type: String,
      required: true,
    },
    recipientAccount: {
      // 收款方账户号码
      type: String,
      required: true,
    },
    recipientShortCode: {
      // 收款方银行代码
      type: String,
      required: true,
    },
    // 如果是本行转账，可以关联到收款方的 User 和 Card ID
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    recipientCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: false,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
