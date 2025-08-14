import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 中间件函数：保护路由，验证用户身份
const protect = async (req, res, next) => {
  let token;

  // 检查请求头中是否有 Authorization 字段，并且以 Bearer 开头
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 从请求头中获取 Token
      token = req.headers.authorization.split(" ")[1];

      // 验证 Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 通过解码后的 ID 查找用户，但不返回密码
      req.user = await User.findById(decoded.id).select("-password");

      next(); // 继续执行下一个中间件或路由处理器
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 如果没有 Token
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect }; // <--- 🌟 确保这里以命名导出的方式导出 protect
