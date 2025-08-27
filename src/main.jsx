import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom"; // 导入 BrowserRouter

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {" "}
      {/* 将 App 组件包裹在 Router 中 */}
      <App />
    </Router>
  </React.StrictMode>
);
