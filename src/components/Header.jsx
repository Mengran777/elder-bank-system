import React from "react";
import { Play } from "lucide-react"; // 仅导入Header组件所需的图标

const Header = ({ setShowHelp, setShowChat }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 relative rounded-b-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 mb-1">ELDER BANK</h1>
          <p className="text-gray-600">
            Don't worry. Everything here is very simple.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md"
          >
            <Play size={16} />
            <span>WATCH GUIDE VIDEO</span>
          </button>
          {/* 这里可以考虑替换成一个更美观的问号图标或帮助按钮 */}
          <div className="text-sm text-gray-500 rounded-full w-6 h-6 flex items-center justify-center border border-gray-400">
            ?
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowChat(true)}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors shadow-sm"
        >
          ASK FOR
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition-colors shadow-sm"
        >
          HELP
        </button>
      </div>
      {/* 背景装饰元素 */}
      <div className="absolute right-0 top-0 w-64 h-full bg-cover bg-center opacity-20 bg-gradient-to-l from-blue-100 rounded-bl-lg"></div>
      <div className="absolute right-8 top-4 w-48 h-32 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg opacity-80 flex items-center justify-center text-gray-500 text-sm shadow-inner">
        Elderly couple image
      </div>
    </div>
  );
};

export default Header; // <--- 确保这一行存在！
