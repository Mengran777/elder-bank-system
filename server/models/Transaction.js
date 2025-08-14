import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    user: {
      // 关联到用户ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    card: {
      // 关联到交易发生的卡片ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Card",
    },
    description: {
      // 交易描述
      type: String,
      required: true,
    },
    type: {
      // 交易类型：Purchase, Bill Payment, Deposit, Transfer, etc.
      type: String,
      required: true,
      enum: [
        "Purchase",
        "Bill Payment",
        "Deposit",
        "Transfer",
        "Withdrawal",
        "Fee",
      ], // 示例类型
    },
    amount: {
      // 交易金额，正数表示收入，负数表示支出
      type: Number,
      required: true,
    },
    // 如果是转账，可以添加更多字段
    recipientAccount: {
      // 接收方账户号
      type: String,
      required: function () {
        return this.type === "Transfer";
      }, // 如果是转账，则必填
    },
    recipientName: {
      // 接收方姓名
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
