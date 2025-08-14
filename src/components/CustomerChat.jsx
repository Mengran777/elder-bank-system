import React, { useRef, useEffect } from "react";
import { X, MessageCircle, Send } from "lucide-react"; // 导入聊天相关图标

const CustomerChatModal = ({
  show,
  onClose,
  messages,
  input,
  setInput,
  onSend,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg h-[80vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center space-x-2">
          <MessageCircle size={24} />
          <span>Customer Support Chat</span>
        </h3>
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.type === "user"
                  ? "bg-blue-500 text-white self-end ml-auto rounded-br-none"
                  : "bg-gray-200 text-gray-800 self-start mr-auto rounded-bl-none"
              }`}
            >
              {msg.message}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 用于滚动到底部 */}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <button
            onClick={onSend}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChatModal;
