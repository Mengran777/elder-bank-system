import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // 确保导入App组件
import "./index.css"; // 如果你有全局CSS文件，请导入

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
