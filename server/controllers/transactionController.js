import Transaction from "../models/Transaction.js";
import Card from "../models/Card.js"; // 用于更新卡片余额
import mongoose from "mongoose"; // 导入 mongoose 用于事务

// @desc    获取用户交易记录
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  // 可以根据查询参数进行筛选，例如 cardId, type, dateRange
  const query = { user: req.user._id };

  // 示例筛选逻辑 (与前端AccountPage的筛选逻辑对应)
  if (req.query.cardId) {
    query.card = req.query.cardId;
  }
  if (req.query.type && req.query.type !== "ALL") {
    if (req.query.type === "Money-in") {
      query.amount = { $gt: 0 };
    } else if (req.query.type === "Money-out") {
      query.amount = { $lt: 0 };
    } else {
      query.type = req.query.type;
    }
  }
  if (req.query.dateFilter && req.query.dateFilter !== "ALL") {
    const now = new Date();
    let startDate;
    if (req.query.dateFilter === "7 days") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (req.query.dateFilter === "1 month") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (req.query.dateFilter === "1 year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    if (startDate) {
      query.createdAt = { $gte: startDate }; // Mongoose的timestamps自动生成createdAt
    }
  }

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 }) // 按最新时间排序
    .populate("card", "number type"); // 关联查询卡片信息，只返回卡号和类型

  res.json(transactions);
};

// @desc    执行转账 (从用户一张卡转到另一张卡 或 给朋友/陌生人)
// @route   POST /api/transactions/transfer
// @access  Private
const createTransfer = async (req, res) => {
  const {
    fromCardId,
    toCardId,
    recipientAccount,
    recipientName,
    recipientShortCode,
    amount,
    transferType,
  } = req.body;

  // 基础验证
  if (!fromCardId || !amount || amount <= 0) {
    res
      .status(400)
      .json({
        message: "Invalid transfer details: Missing source card or amount.",
      });
    return;
  }

  const fromCard = await Card.findById(fromCardId);

  if (!fromCard || fromCard.user.toString() !== req.user._id.toString()) {
    res
      .status(404)
      .json({ message: "Source card not found or not authorized." });
    return;
  }

  if (fromCard.balance < amount) {
    res.status(400).json({ message: "Insufficient balance on source card." });
    return;
  }

  let actualRecipientAccount = recipientAccount;
  let actualRecipientName = recipientName;
  let actualRecipientShortCode = recipientShortCode;
  let toCard = null; // 在 try 块外部声明，以便在不同作用域中使用

  // 验证转账类型和接收方信息
  if (transferType === "self") {
    if (!toCardId) {
      res
        .status(400)
        .json({
          message: "For self transfer, a destination card is required.",
        });
      return;
    }
    // ✨ 优化：对于自转账，从目标卡获取接收方信息
    toCard = await Card.findById(toCardId);
    if (!toCard || toCard.user.toString() !== req.user._id.toString()) {
      res
        .status(404)
        .json({
          message:
            "Destination card not found or not authorized for self transfer.",
        });
      return;
    }
    if (fromCard._id.toString() === toCard._id.toString()) {
      res.status(400).json({ message: "Cannot transfer to the same card." });
      return;
    }
    actualRecipientAccount = toCard.accountNumber;
    actualRecipientName = toCard.holder;
    actualRecipientShortCode = toCard.shortCode;
  } else if (transferType === "friends" || transferType === "others") {
    if (!recipientAccount || !recipientShortCode) {
      res
        .status(400)
        .json({
          message:
            "For external transfers, recipient account and short code are required.",
        });
      return;
    }
  } else {
    res.status(400).json({ message: "Invalid transfer type." });
    return;
  }

  // 使用事务确保操作的原子性（仅支持MongoDB 4.0+ 副本集）
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 扣除转出卡余额
    fromCard.balance -= amount;
    await fromCard.save({ session });

    // 创建支出交易记录
    const outgoingTransaction = await Transaction.create(
      [
        {
          user: req.user._id,
          card: fromCard._id,
          // ✨ 优化：使用实际的接收方信息在描述中
          description: `Transfer to ${
            actualRecipientName || actualRecipientAccount || "Unknown"
          }`,
          type: "debit", // 交易类型为 'debit' (出账)
          amount: -amount, // 支出为负数
          senderAccount: fromCard.accountNumber, // 转出卡账户号
          senderShortCode: fromCard.shortCode, // 转出卡 Short Code
          recipientAccount: actualRecipientAccount, // ✨ 优化：使用实际的接收方账户
          recipientName: actualRecipientName, // ✨ 优化：使用实际的接收方姓名
          recipientShortCode: actualRecipientShortCode, // ✨ 优化：使用实际的接收方 Short Code
        },
      ],
      { session }
    );

    let incomingTransaction;
    if (transferType === "self") {
      // 此时 toCard 变量已经通过上面的逻辑赋值
      // 增加转入卡余额
      toCard.balance += amount;
      await toCard.save({ session });

      // 创建收入交易记录
      incomingTransaction = await Transaction.create(
        [
          {
            user: req.user._id,
            card: toCard._id,
            description: `Transfer from ${fromCard.accountNumber} (Self)`,
            type: "credit", // 交易类型为 'credit' (入账)
            amount: amount, // 收入为正数
            senderAccount: fromCard.accountNumber, // 来源卡账户号
            senderShortCode: fromCard.shortCode, // 来源卡 Short Code
            recipientAccount: toCard.accountNumber, // 收款方为自己另一张卡的账户号
            recipientName: toCard.holder, // 收款方为自己另一张卡的持卡人姓名
            recipientShortCode: toCard.shortCode, // 收款方 Short Code
          },
        ],
        { session }
      );
    } else if (transferType === "friends" || transferType === "others") {
      // 模拟给朋友或陌生人转账，这里不涉及收款方卡片更新
      // 实际应用中需要与收款方的银行系统集成
    }

    await session.commitTransaction(); // 提交事务
    res
      .status(200)
      .json({
        message: "Transfer successful",
        outgoingTransaction,
        incomingTransaction,
      });
  } catch (error) {
    await session.abortTransaction(); // 回滚事务
    console.error("Transfer failed:", error);
    // 区分 Mongoose 验证错误和其他错误
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      res
        .status(500)
        .json({
          message:
            error.message || "Transfer failed due to an unexpected error.",
        });
    }
  } finally {
    session.endSession(); // 结束会话
  }
};

export { getTransactions, createTransfer };
