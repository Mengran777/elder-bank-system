import Card from "../models/Card.js";
import mongoose from "mongoose"; // Import mongoose to identify ValidationError

// @desc    Get all user bank cards
// @route   GET /api/cards
// @access  Private
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user._id });
    res.json(cards);
  } catch (error) {
    console.error("Error in getCards:", error);
    res.status(500).json({ message: "Failed to fetch cards" });
  }
};

// @desc    Add bank card
// @route   POST /api/cards
// @access  Private
const addCard = async (req, res) => {
  console.log("Backend received req.body:", req.body);
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
    const cardExists = await Card.findOne({
      number: cardId,
      user: req.user._id,
    });
    if (cardExists) {
      res.status(400).json({
        message: "Card with this number already exists for this user",
      });
      return;
    } // Create a new card, ensuring the fields map correctly to the Mongoose model

    const card = await Card.create({
      user: req.user._id, // Associate with the current user
      accountNumber, // accountNumber field in the Mongoose model
      number: cardId, // Map the front-end `cardId` to the back-end model's `number` field (card number)
      holder: name, // `holder` field in the Mongoose model
      shortCode, // `shortCode` field in the Mongoose model
      bank: openingBank, // `bank` field in the Mongoose model
      expires, // `expires` field in the Mongoose model
      type, // `type` field in the Mongoose model // Pin should not be stored directly or needs to be encrypted; for now, we ignore storing the pin
      balance: Math.floor(Math.random() * 100000) + 1, // Set balance to a random number between 1 and 100000
    }); // If the card was created successfully

    res.status(201).json({
      _id: card._id,
      accountNumber: card.accountNumber,
      type: card.type,
      balance: card.balance,
      holder: card.holder,
      number: card.number, // Return the correct card number
      expires: card.expires,
      shortCode: card.shortCode, // Ensure shortCode is returned
      bank: card.bank,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
  } catch (error) {
    console.error("Error adding card:", error); // Handle Mongoose validation errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      res.status(500).json({ message: error.message || "Failed to add card." });
    }
  }
};

// @desc    Delete bank card
// @route   DELETE /api/cards/:id
// @access  Private
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id); // Check if the card exists and belongs to the current user

    if (card && card.user.toString() === req.user._id.toString()) {
      await card.deleteOne(); // Use deleteOne()
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
