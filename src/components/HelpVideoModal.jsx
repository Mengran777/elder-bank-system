import React from "react";
import { X, Video } from "lucide-react";

const HelpVideoModal = ({ show, onClose, videoContentKey }) => {
  if (!show) return null;

  // Define different video content based on videoContentKey
  const videoContent = {
    account: {
      title: "Account Management Guide",
      description:
        "This video guides you on how to view your bank cards, manage card balances, and review transaction history.",
      // Replace with actual video embed code or URL
      videoUrl: "https://www.youtube.com/embed/account-guide-video-id", // Example URL
    },
    transfer: {
      title: "Transfer Operations Guide",
      description:
        "This video provides detailed instructions on how to perform transfers to your own accounts, friends, or other recipients.",
      videoUrl: "https://www.youtube.com/embed/transfer-guide-video-id", // Example URL
    },
    settings: {
      title: "Security Settings Guide",
      description:
        "Learn how to lock/unlock your bank cards and change your account password to ensure your account security.",
      videoUrl: "https://www.youtube.com/embed/settings-guide-video-id", // Example URL
    },
    default: {
      // Default content when videoContentKey does not match
      title: "System Overview Guide",
      description:
        "Welcome to the Elder Bank System! This video introduces you to the main functionalities of the system.",
      videoUrl: "https://www.youtube.com/embed/general-guide-video-id", // Example URL
    },
  };

  // Get content based on the provided key, or use default if not found
  const currentVideo = videoContent[videoContentKey] || videoContent.default;

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
          <span>{currentVideo.title}</span>
        </h3>
        <div className="aspect-video w-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-6">
          {/* You can embed actual video players here, e.g., YouTube embed code */}
          <p>{currentVideo.description}</p>
          {/* If integrating actual video, you can use an iframe:
            <iframe
              width="560"
              height="315"
              src={currentVideo.videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={currentVideo.title}
            ></iframe>
          */}
        </div>
        <p className="text-gray-700">
          {currentVideo.description}
          {/* You can add more general info as needed */}
          {videoContentKey === "default" &&
            " If you have further questions, please use the customer chat function."}
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
