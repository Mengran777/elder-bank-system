import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { accountName, accountId, password, email, phone } = req.body;

  const userExists = await User.findOne({ accountId });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    accountName,
    accountId,
    password,
    email,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      accountName: user.accountName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { accountId, password } = req.body;

  const user = await User.findOne({ accountId });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      accountName: user.accountName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid account ID or password" });
  }
};

export { registerUser, loginUser };
