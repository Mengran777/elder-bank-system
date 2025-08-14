import React from "react";
import { Home } from "lucide-react"; // 仅导入Navigation组件所需的图标

const NavigationTabs = ({ setCurrentPage, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white shadow-sm rounded-t-lg mt-4 mx-auto max-w-6xl">
      <div className="flex">
        <button
          onClick={() => setCurrentPage("login")} // 回到登录页
          className="px-6 py-3 bg-blue-600 text-white font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors rounded-tl-lg shadow-md"
        >
          <Home size={20} />
          <span>HOME</span>
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors rounded-tr-lg ${
            activeTab === "account"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("transfer")}
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors ${
            activeTab === "transfer"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Transfer
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-3 font-semibold border-b-2 hover:bg-blue-50 transition-colors ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600"
          }`}
        >
          Setting
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
