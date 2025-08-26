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
    selectedToCardId, // 'self' transfer type
    selectedFriendId, // 'friends' transfer type
    strangerAccount, // 'others' transfer type
    recipientShortCode, // 'others' transfer type
  } = req.body;

  // 1. Find the fromCard
  const fromCard = await Card.findById(fromCardId);

  // Validate fromCard and user ownership
  if (!fromCard || fromCard.user.toString() !== req.user._id.toString()) {
    res.status(404).json({ message: "From card not found or not authorized" });
    return;
  }

  // Validate sufficient balance
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
    // 2. Transfer to own account
    toCard = await Card.findById(selectedToCardId);

    // Validate toCard
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
    recipientUser = toCard.user; // Recipient is the current user
    descriptionForDebit = `Transfer to own account ${toCard.accountNumber}`;
    descriptionForCredit = `Transfer from own account ${fromCard.accountNumber}`;
  } else if (transferType === "friends") {
    // ** 修改开始 **
    // 3. Transfer to friends
    const friend = await User.findById(selectedFriendId);

    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    // Find the friend's default card
    toCard = await Card.findOne({ user: friend._id });

    // Validate if the friend has a card to receive money
    if (!toCard) {
      res.status(404).json({
        message: "Recipient does not have an active card to receive transfer.",
      });
      return;
    }

    recipientUser = friend._id;
    recipientAccNum = toCard.accountNumber;
    // 关键修改: Short Code 不再从前端传入。
    // 我们从朋友的卡片信息中获取 Short Code。
    recipientSC = toCard.shortCode;

    descriptionForDebit = `Transfer to friend ${friend.name} (${toCard.accountNumber})`;
    descriptionForCredit = `Transfer from ${req.user.name} (${fromCard.accountNumber}) (via friend transfer)`;
    // ** 修改结束 **
  } else if (transferType === "others") {
    // 4. Transfer to others (external account)
    if (!strangerAccount || !recipientShortCode) {
      res.status(400).json({
        message:
          "Recipient account number and short code are required for external transfer",
      });
      return;
    }
    recipientAccNum = strangerAccount;
    recipientSC = recipientShortCode;
    // External transfer has no recipientUser or recipientCard
    descriptionForDebit = `Transfer to external account ${strangerAccount} (${recipientShortCode})`;
    descriptionForCredit = `Transfer from ${req.user.name} (${fromCard.accountNumber}) (via external transfer)`;
  } else {
    res.status(400).json({ message: "Invalid transfer type" });
    return;
  }

  // Start database operations (using a transaction for atomicity is recommended)
  try {
    // Deduct amount from the sender's card
    fromCard.balance -= transferAmount;
    await fromCard.save();

    // If there is a recipient card (internal transfer), add the amount
    if (toCard) {
      toCard.balance += transferAmount;
      await toCard.save();
    }

    // Create a debit transaction for the sender
    const debitTransaction = await Transaction.create({
      user: req.user._id,
      card: fromCard._id,
      type: "debit",
      amount: -transferAmount,
      description: descriptionForDebit,
      senderAccount: fromCard.accountNumber,
      senderShortCode: fromCard.shortCode,
      recipientAccount: recipientAccNum,
      recipientShortCode: recipientSC,
      recipientUser: recipientUser,
      recipientCard: toCard ? toCard._id : undefined,
    });

    // Create a credit transaction for the recipient if they are an internal user
    if (recipientUser) {
      await Transaction.create({
        user: recipientUser,
        card: toCard ? toCard._id : undefined,
        type: "credit",
        amount: transferAmount,
        description: descriptionForCredit,
        senderAccount: fromCard.accountNumber,
        senderShortCode: fromCard.shortCode,
        recipientAccount: recipientAccNum,
        recipientShortCode: recipientSC,
        recipientUser: recipientUser,
        recipientCard: toCard ? toCard._id : undefined,
      });
    }

    res.status(200).json({
      message: "Transfer successful",
      fromCard: fromCard,
      toCard: toCard,
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
