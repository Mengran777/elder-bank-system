import Transaction from "../models/Transaction.js";
import Card from "../models/Card.js";
import User from "../models/User.js";

// @desc    Get all transactions of a user (supports filtering by cardId)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  // Filter by current logged-in user
  const query = { user: req.user._id };

  // Filter by cardId if provided
  if (req.query.cardId) {
    query.card = req.query.cardId;
  }

  // Filter by date range
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

  // Filter by transaction type (Money-in / Money-out)
  if (req.query.typeFilter && req.query.typeFilter !== "ALL") {
    if (req.query.typeFilter === "Money-in") {
      query.amount = { $gt: 0 };
    } else if (req.query.typeFilter === "Money-out") {
      query.amount = { $lt: 0 };
    }
  }

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .populate("card", "number type"); // Populate card info with number and type
  res.json(transactions);
};

// @desc    Create a transfer
// @route   POST /api/transactions/transfer
// @access  Private
const createTransfer = async (req, res) => {
  const {
    fromCardId,
    transferAmount, // Always positive
    transferType,
    selectedToCardId, // For self-transfer
    selectedFriendId, // For friend transfer
    strangerAccount, // For external transfer
    recipientShortCode, // For external transfer (friends will be handled on backend)
  } = req.body;

  // Find source card
  const fromCard = await Card.findById(fromCardId);

  // Validate ownership
  if (!fromCard || fromCard.user.toString() !== req.user._id.toString()) {
    res.status(404).json({ message: "From card not found or not authorized" });
    return;
  }

  // Check balance
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
    // Transfer to own account
    toCard = await Card.findById(selectedToCardId);
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
    recipientUser = toCard.user;
    descriptionForDebit = `Transfer to own account ${toCard.accountNumber}`;
    descriptionForCredit = `Transfer from own account ${fromCard.accountNumber}`;
  } else if (transferType === "friends") {
    // Transfer to friend (must be a registered user)
    const friend = await User.findById(selectedFriendId);
    if (!friend) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    // Assume friend has at least one card
    toCard = await Card.findOne({ user: friend._id });
    if (!toCard) {
      res.status(400).json({
        message: `Friend ${friend.accountName} does not have an active card to receive funds.`,
      });
      return;
    }

    recipientUser = friend._id;
    recipientAccNum = toCard.accountNumber;
    recipientSC = toCard.shortCode;
    descriptionForDebit = `Transfer to friend ${friend.accountName} (${toCard.accountNumber})`;
    descriptionForCredit = `Transfer from ${req.user.accountName} (to friend ${friend.accountName})`;
  } else if (transferType === "others") {
    // Transfer to external account
    if (!strangerAccount || !recipientShortCode) {
      res.status(400).json({
        message:
          "Recipient account number and short code are required for external transfer",
      });
      return;
    }
    recipientAccNum = strangerAccount;
    recipientSC = recipientShortCode;
    descriptionForDebit = `Transfer to external account ${strangerAccount} (${recipientShortCode})`;
    descriptionForCredit = `External transfer received from ${req.user.accountName} (${fromCard.accountNumber})`;
  } else {
    res.status(400).json({ message: "Invalid transfer type" });
    return;
  }

  try {
    // Deduct from sender card
    fromCard.balance -= transferAmount;
    await fromCard.save();

    // Credit recipient card if internal transfer
    if (toCard) {
      toCard.balance += transferAmount;
      await toCard.save();
    }

    // Create sender transaction (Debit)
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

    // Create recipient transaction (Credit) if recipient is a registered user
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
