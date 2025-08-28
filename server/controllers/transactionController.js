import Transaction from "../models/Transaction.js";
import Card from "../models/Card.js";
import User from "../models/User.js"; // 导入 User 模型以便查找收款人

// @desc    获取用户所有交易记录 (现在支持按卡片ID筛选)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  // 从 req.user._id 获取当前登录用户 ID
  const query = { user: req.user._id };

  // ✨ 新增：如果存在 cardId 查询参数，则添加到过滤条件中
  if (req.query.cardId) {
    query.card = req.query.cardId;
  }

  // 根据日期筛选
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
      query.createdAt = { $gte: startDate };
    }
  }

  // 根据类型筛选 (Money-in/Money-out)
  if (req.query.typeFilter && req.query.typeFilter !== "ALL") {
    if (req.query.typeFilter === "Money-in") {
      query.amount = { $gt: 0 };
    } else if (req.query.typeFilter === "Money-out") {
      query.amount = { $lt: 0 };
    }
  }

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .populate("card", "number type"); // 关联查询卡片信息，只返回卡号和类型
  res.json(transactions);
};

// @desc    创建转账
// @route   POST /api/transactions/transfer
// @access  Private
const createTransfer = async (req, res) => {
  const {
    fromCardId,
    transferAmount, // This amount is always positive from the frontend
    transferType,
    selectedToCardId, // 'self' 转账用到
    selectedFriendId, // 'friends' 转账用到
    strangerAccount, // 'others' 转账用到
    recipientShortCode, // 'others' 转账用到，'friends' 类型由后端获取
  } = req.body;

  // 1. 查找转出卡
  const fromCard = await Card.findById(fromCardId);

  // 验证转出卡是否存在且属于当前用户
  if (!fromCard || fromCard.user.toString() !== req.user._id.toString()) {
    res.status(404).json({ message: "From card not found or not authorized" });
    return;
  }

  // 验证余额是否充足
  if (fromCard.balance < transferAmount) {
    res.status(400).json({ message: "Insufficient balance" });
    return;
  }

  let toCard = null;
  let recipientUser = null;
  let recipientAccNum = "";
  let recipientSC = ""; // ✨ 初始化收款方 Short Code
  let descriptionForDebit = "";
  let descriptionForCredit = "";

  if (transferType === "self") {
    // 2. 如果是转账给自己账户
    toCard = await Card.findById(selectedToCardId);

    // 验证转入卡是否存在且属于当前用户，且不能是同一张卡
    if (
      !toCard ||
      toCard.user.toString() !== req.user._id.toString() ||
      toCard._id.toString() === fromCard._id.toString()
    ) {
      res
        .status(400)
        .json({ message: "Invalid to card selected for self-transfer" });
      return;
    }
    recipientAccNum = toCard.accountNumber;
    recipientSC = toCard.shortCode; // ✨ 从转入卡获取 shortCode
    recipientUser = toCard.user; // 收款方是当前用户
    descriptionForDebit = `Transfer to own account ${toCard.accountNumber}`;
    descriptionForCredit = `Transfer from own account ${fromCard.accountNumber}`;
  } else if (transferType === "friends") {
    // 3. 如果是转账给朋友
    const friend = await User.findById(selectedFriendId); // 假设朋友也是注册用户
    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }
    // 查找朋友的默认卡片以获取其 Short Code 和 Account Number
    toCard = await Card.findOne({ user: friend._id }); // 假设朋友有一张默认卡片

    if (!toCard) {
      // 如果朋友没有卡片，则无法进行基于卡片的转账
      res.status(400).json({
        message: `Friend ${friend.accountName} does not have an active card to receive funds.`,
      });
      return;
    }

    recipientUser = friend._id;
    recipientAccNum = toCard.accountNumber; // ✨ 使用朋友卡片的 accountNumber 作为收款账号
    recipientSC = toCard.shortCode; // ✨ 从朋友卡片获取 shortCode
    descriptionForDebit = `Transfer to friend ${friend.accountName} (${toCard.accountNumber})`;
    descriptionForCredit = `Transfer from ${req.user.accountName} (to friend ${friend.accountName})`; // 朋友收到的描述
  } else if (transferType === "others") {
    // 4. 如果是转账给他人 (外部账户)
    if (!strangerAccount || !recipientShortCode) {
      res.status(400).json({
        message:
          "Recipient account number and short code are required for external transfer",
      });
      return;
    }
    recipientAccNum = strangerAccount;
    recipientSC = recipientShortCode; // ✨ 从前端传入 (对于外部转账是必填项)
    descriptionForDebit = `Transfer to external account ${strangerAccount} (${recipientShortCode})`;
    descriptionForCredit = `External transfer received from ${req.user.accountName} (${fromCard.accountNumber})`; // 外部账户收到的描述 (这里不会真的创建外部记录)
  } else {
    res.status(400).json({ message: "Invalid transfer type" });
    return;
  }

  // 开始数据库操作
  try {
    // 扣除转出方卡片余额
    fromCard.balance -= transferAmount;
    await fromCard.save();

    // 如果有转入方卡片 (本行转账)，增加其余额
    if (toCard) {
      toCard.balance += transferAmount;
      await toCard.save();
    }

    // 创建转出方交易记录 (Debit)
    const debitTransaction = await Transaction.create({
      user: req.user._id,
      card: fromCard._id,
      type: "debit",
      amount: -transferAmount, // 转出金额存储为负数
      description: descriptionForDebit,
      senderAccount: fromCard.accountNumber,
      senderShortCode: fromCard.shortCode,
      recipientAccount: recipientAccNum,
      recipientShortCode: recipientSC,
      recipientUser: recipientUser, // 关联收款方用户ID (如果是本行用户)
      recipientCard: toCard ? toCard._id : undefined, // 关联收款方卡片ID (如果是本行卡)
    });

    // 如果收款方是本行用户或朋友 (实际应用中会是真实入账，这里简化为创建第二条交易记录)
    if (recipientUser) {
      // 仅当收款方是本行注册用户时才为收款方创建交易记录
      await Transaction.create({
        user: recipientUser, // 收款方用户ID
        card: toCard ? toCard._id : undefined, // 收款方卡片ID
        type: "credit",
        amount: transferAmount, // 入账金额存储为正数
        description: descriptionForCredit,
        senderAccount: fromCard.accountNumber, // 转出方信息
        senderShortCode: fromCard.shortCode,
        recipientAccount: recipientAccNum, // 收款方信息
        recipientShortCode: recipientSC,
        recipientUser: recipientUser,
        recipientCard: toCard ? toCard._id : undefined,
      });
    }

    res.status(200).json({
      message: "Transfer successful",
      fromCard: fromCard,
      toCard: toCard, // 如果有 toCard
      debitTransaction: debitTransaction,
    });
  } catch (error) {
    console.error("Transfer failed:", error);
    res.status(500).json({
      message: "Transfer failed due to server error",
      error: error.message,
    });
  }
};

export { getTransactions, createTransfer };
