import Card from "../models/Card.js";

// @desc    获取所有用户银行卡
// @route   GET /api/cards
// @access  Private
const getCards = async (req, res) => {
  // req.user._id 来自 authMiddleware，表示当前登录用户
  const cards = await Card.find({ user: req.user._id });
  res.json(cards);
};

// @desc    添加新银行卡
// @route   POST /api/cards
// @access  Private
const addCard = async (req, res) => {
  const {
    accountNumber,
    cardId,
    shortCode,
    name,
    openingBank,
    pin,
    type,
    expiresEnd,
  } = req.body;

  // 检查是否已存在相同卡号
  const cardExists = await Card.findOne({
    number: accountNumber,
    user: req.user._id,
  });
  if (cardExists) {
    res.status(400).json({
      message: "Card with this account number already exists for this user",
    });
    return;
  }

  // 创建新卡片
  const card = await Card.create({
    user: req.user._id, // 关联到当前用户
    accountNumber,
    number: accountNumber, // 将 account Number 作为卡号存储，或者生成一个卡号
    holder: name,
    shortCode,
    bank: openingBank,
    expires: expiresEnd,
    type,
    // pin 不应直接存储，这里只是示例，实际应处理成验证逻辑
    balance: Math.floor(Math.random() * 100000) + 1,
  });

  if (card) {
    res.status(201).json({
      _id: card._id,
      accountNumber: card.accountNumber,
      type: card.type,
      balance: card.balance,
      holder: card.holder,
      number: card.number,
      expires: card.expires,
      bank: card.bank,
    });
  } else {
    res.status(400).json({ message: "Invalid card data" });
  }
};

// @desc    删除银行卡
// @route   DELETE /api/cards/:id
// @access  Private
const deleteCard = async (req, res) => {
  const card = await Card.findById(req.params.id);

  // 检查卡片是否存在且属于当前用户
  if (card && card.user.toString() === req.user._id.toString()) {
    await card.deleteOne(); // 使用 deleteOne()
    res.json({ message: "Card removed" });
  } else {
    res.status(404).json({ message: "Card not found or not authorized" });
  }
};

export { getCards, addCard, deleteCard };
