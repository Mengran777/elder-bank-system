import React from "react";
import { Play, MessageSquare } from "lucide-react"; // 导入Header组件所需的图标，新增 MessageSquare

const Header = ({ setShowHelp, setShowChat, handleLogout }) => {
  // 确保 handleLogout 也传入
  return (
    <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 relative rounded-b-lg shadow-md">
      {/* 主头部容器，使用 flex 布局使其内部元素左右分布 */}
      <div className="flex items-start justify-between">
        {" "}
        {/* Changed items-center to items-start for better alignment */}
        {/* 左侧：标题和描述 */}
        <div className="flex-shrink-0">
          {" "}
          {/* Use flex-shrink-0 to prevent shrinking */}
          <h1 className="text-2xl font-bold text-blue-900 mb-1">ELDER BANK</h1>
          <p className="text-gray-600">
            Don't worry. Everything here is very simple.
          </p>
        </div>
        {/* 右侧：所有按钮容器，使用 flex-col 使按钮垂直排列 */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          {" "}
          {/* Added ml-4 for spacing from left content */}
          {/* WATCH GUIDE VIDEO 按钮组 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHelp(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
            >
              <Play size={16} />
              <span>WATCH GUIDE VIDEO</span>
            </button>
            {/* 问号图标，保持不变 */}
            <div className="text-sm text-gray-500 rounded-full w-6 h-6 flex items-center justify-center border border-gray-400">
              ?
            </div>
          </div>
          {/* ASK FOR HELP 和 LOGOUT 按钮组 */}
          <div className="flex space-x-2">
            {" "}
            {/* Removed absolute positioning */}
            {/* 合并后的“ASK FOR HELP”按钮 */}
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center space-x-1"
            >
              <MessageSquare size={14} /> {/* 添加一个聊天图标 */}
              <span>ASK FOR HELP</span>
            </button>
            {/* 登出按钮 - 如果需要 */}
            {handleLogout && (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors shadow-sm"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
      {/* 背景装饰元素 - 保持不变，并添加 pointer-events-none */}
      <div className="absolute right-0 top-0 w-64 h-full bg-cover bg-center opacity-20 bg-gradient-to-l from-blue-100 rounded-bl-lg pointer-events-none"></div>{" "}
      {/* 🌟 关键修改在这里！ */}
    </div>
  );
};

export default Header;
