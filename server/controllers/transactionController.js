import Transaction from "../models/Transaction.js";
import Card from "../models/Card.js";
import User from "../models/User.js"; // 导入 User 模型以便查找收款人

// @desc    获取用户所有交易记录
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  // 从 req.user._id 获取当前登录用户 ID
  const transactions = await Transaction.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
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
    recipientShortCode, // 'friends' 和 'others' 转账用到
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
  let recipientSC = "";
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
    recipientSC = toCard.shortCode;
    recipientUser = toCard.user; // 收款方是当前用户
    descriptionForDebit = `Transfer to own account ${toCard.accountNumber}`;
    descriptionForCredit = `Transfer from own account ${fromCard.accountNumber}`;
  } else if (transferType === "friends") {
    // 3. 如果是转账给朋友 (这里我们假设朋友只是一个本地列表，或者将来有Friends模型)
    // 暂时我们没有朋友的Card ID，所以这里无法更新朋友的余额，只能记录交易
    // 假设 selectedFriendId 是朋友的 _id，并且你可以从 friends 列表/数据库中找到其 accountNumber 和 shortCode
    const friend = await User.findById(selectedFriendId); // 假设朋友也是注册用户
    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }
    // 查找朋友的默认卡片 (这里简化，实际需要更复杂的逻辑)
    toCard = await Card.findOne({ user: friend._id });

    recipientUser = friend._id;
    recipientAccNum = friend.accountId; // 假设朋友的accountId就是其收款账号
    recipientSC = recipientShortCode; // 从前端传入
    descriptionForDebit = `Transfer to friend ${friend.accountName} (${friend.accountId})`;
    descriptionForCredit = `Transfer from ${req.user.accountName} (${fromCard.accountNumber}) (via friend transfer)`; // 朋友收到的描述
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
    recipientSC = recipientShortCode;
    // 外部转账没有 recipientUser 或 recipientCard
    descriptionForDebit = `Transfer to external account ${strangerAccount} (${recipientShortCode})`;
    descriptionForCredit = `Transfer from ${req.user.accountName} (${fromCard.accountNumber}) (via external transfer)`; // 外部账户收到的描述 (这里不会真的创建外部记录)
  } else {
    res.status(400).json({ message: "Invalid transfer type" });
    return;
  }

  // 开始数据库操作 (使用事务确保原子性，但Mongoose的事务需要在副本集上)
  // 简化：直接执行更新和创建，如果失败，可能需要手动回滚或重试机制
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
      amount: -transferAmount, // 🌟 关键修改：转出金额存储为负数
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
        amount: transferAmount, // 🌟 关键修改：入账金额存储为正数
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
