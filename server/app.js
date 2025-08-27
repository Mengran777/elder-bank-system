import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

connectDB();

const app = express();

// CORS 配置 (允许前端访问后端)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// 解析 JSON 格式的请求体
app.use(express.json());

// 定义API路由
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/transactions", transactionRoutes);

// 基本根路由
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🌟 新增：错误处理中间件
// 这是一个 Express 错误处理中间件，它有四个参数 (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack); // 在服务器控制台打印错误堆栈
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 如果状态码是200，则改为500，否则保持原状
  res.status(statusCode);
  res.json({
    message: err.message, // 发送错误消息给客户端
    // 在开发模式下，可以发送完整的错误堆栈，在生产模式下则不建议
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
