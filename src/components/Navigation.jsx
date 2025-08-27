import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // 导入 Link 和 useLocation 钩子
import { Home } from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  // 移除 setCurrentPage prop
  const location = useLocation(); // 获取当前路由位置

  // 根据当前路由路径更新 activeTab 状态
  useEffect(() => {
    if (location.pathname.includes("/account")) {
      setActiveTab("account");
    } else if (location.pathname.includes("/transfer")) {
      setActiveTab("transfer");
    } else if (location.pathname.includes("/settings")) {
      setActiveTab("settings");
    }
  }, [location.pathname, setActiveTab]); // 依赖 location.pathname 和 setActiveTab

  return (
    <div className="bg-white shadow-sm rounded-t-lg mt-4 mx-auto max-w-6xl">
      <div className="flex">
        <Link
          to="/account" // 默认首页导航到账户页
          className="px-6 py-3 bg-blue-600 text-white font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors rounded-tl-lg shadow-md"
        >
          <Home size={20} />
          <span>HOME</span>
        </Link>
        <Link
          to="/account"
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors rounded-tr-lg ${
            activeTab === "account"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Account
        </Link>
        <Link
          to="/transfer"
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors ${
            activeTab === "transfer"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Transfer
        </Link>
        <Link
          to="/settings"
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Setting
        </Link>
      </div>
    </div>
  );
};

export default NavigationTabs;
