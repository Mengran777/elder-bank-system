import Card from "../models/Card.js";
import mongoose from "mongoose"; // 导入 mongoose 用于识别 ValidationError

// @desc    获取所有用户银行卡
// @route   GET /api/cards
// @access  Private
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user._id });
    res.json(cards);
  } catch (error) {
    console.error("Error in getCards:", error);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
};

// @desc    添加新银行卡
// @route   POST /api/cards
// @access  Private
const addCard = async (req, res) => {
  // ✨ 新增：在控制器接收到请求后，立即打印 req.body 的内容，用于调试
  console.log("Backend received req.body:", req.body);

  // 从 req.body 解构数据，确保字段名与前端 AddCardModal 准确匹配
  const {
    accountNumber,
    cardId,
    shortCode,
    name,
    openingBank,
    pin,
    type,
    expires,
  } = req.body;

  try {
    // 修正1：检查是否已存在相同【卡号】，应使用前端传入的 cardId (实际卡号)
    const cardExists = await Card.findOne({
      number: cardId,
      user: req.user._id,
    });
    if (cardExists) {
      res
        .status(400)
        .json({
          message: "Card with this number already exists for this user",
        });
      return;
    }

    // 创建新卡片，确保映射到 Mongoose 模型的正确字段
    const card = await Card.create({
      user: req.user._id, // 关联到当前用户
      accountNumber, // Mongoose 模型中的 accountNumber 字段
      number: cardId, // 修正2：将前端的 `cardId` 映射到后端模型的 `number` 字段 (卡号)
      holder: name, // Mongoose 模型中的 `holder` 字段
      shortCode, // Mongoose 模型中的 `shortCode` 字段
      bank: openingBank, // Mongoose 模型中的 `bank` 字段
      expires, // Mongoose 模型中的 `expires` 字段
      type, // Mongoose 模型中的 `type` 字段
      // pin 不应直接存储，或需要加密处理，这里暂时忽略存储pin
      balance: Math.floor(Math.random() * 100000) + 1, // 余额设置为1到100000之间的随机数
    });

    // 如果卡片成功创建
    res.status(201).json({
      _id: card._id,
      accountNumber: card.accountNumber,
      type: card.type,
      balance: card.balance,
      holder: card.holder,
      number: card.number, // 返回正确的卡号
      expires: card.expires,
      shortCode: card.shortCode, // 确保返回 shortCode
      bank: card.bank,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
  } catch (error) {
    console.error("Error adding card:", error);
    // 专门处理 Mongoose 验证错误
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      res.status(500).json({ message: error.message || "Failed to add card." });
    }
  }
};

// @desc    删除银行卡
// @route   DELETE /api/cards/:id
// @access  Private
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    // 检查卡片是否存在且属于当前用户
    if (card && card.user.toString() === req.user._id.toString()) {
      await card.deleteOne(); // 使用 deleteOne()
      res.json({ message: "Card removed" });
    } else {
      res.status(404).json({ message: "Card not found or not authorized" });
    }
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Failed to delete card." });
  }
};

export { getCards, addCard, deleteCard };
