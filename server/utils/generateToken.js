import jwt from "jsonwebtoken";

// 生成 JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token 30天后过期
  });
};

export default generateToken;
