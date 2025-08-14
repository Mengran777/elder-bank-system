import React from "react";
import { X, Video } from "lucide-react"; // 导入模态框关闭和视频图标

const HelpVideoModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center space-x-2">
          <Video size={24} />
          <span>Guide Video</span>
        </h3>
        <div className="aspect-video w-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-6">
          {/* 这里可以嵌入实际的视频播放器，例如 YouTube 嵌入代码 */}
          <p>Placeholder for guide video</p>
        </div>
        <p className="text-gray-700">
          This video will guide you through the main features of the Elder Bank
          System. If you have further questions, please use the customer chat
          feature.
        </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpVideoModal;
