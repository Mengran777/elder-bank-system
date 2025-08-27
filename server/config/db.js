import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // 🌟 修改：移除 process.exit(1); 服务器将继续运行，但数据库功能将受影响
    // 在生产环境中，您可能需要实现更复杂的重试逻辑或健康检查
  }
};

export default connectDB;
