import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";

dotenv.config();

connectDB();

const app = express();

// --- 完善的 CORS 配置 (无需安装包) ---
app.use((req, res, next) => {
  // 设置允许跨域访问的源
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  // 设置允许的 HTTP 方法
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // 设置允许的请求头部
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // 允许携带凭证（如 cookies, authorization headers）
  res.header("Access-Control-Allow-Credentials", "true");

  // 关键修复：处理 OPTIONS 预检请求
  // 浏览器发送 OPTIONS 请求来检查服务器是否允许实际的请求。
  // 如果是 OPTIONS 请求，我们直接发送 200 状态码并结束响应。
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }

  // 如果不是 OPTIONS 请求，则继续下一个中间件
  next();
});

// Parse JSON request bodies
app.use(express.json());

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/friends", friendRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
