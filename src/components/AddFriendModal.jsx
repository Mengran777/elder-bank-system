import React from "react";
import { X } from "lucide-react"; // Import close icon for the modal

const AddFriendModal = ({
  show,
  onClose,
  onConfirm,
  newFriend,
  setNewFriend,
}) => {
  if (!show) return null; // Do not render if 'show' is false

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-blue-900 mb-4">Add New Friend</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="friendName"
              className="block text-gray-800 font-semibold mb-2"
            >
              Friend Name:
            </label>
            <input
              type="text"
              id="friendName"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newFriend.name}
              onChange={(e) =>
                setNewFriend({ ...newFriend, name: e.target.value })
              }
              placeholder="Enter friend's name"
            />
          </div>
          <div>
            <label
              htmlFor="friendAccount"
              className="block text-gray-800 font-semibold mb-2"
            >
              Account Number:
            </label>
            <input
              type="text"
              id="friendAccount"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={newFriend.accountNumber}
              onChange={(e) =>
                setNewFriend({ ...newFriend, accountNumber: e.target.value })
              }
              placeholder="Enter friend's account number"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(newFriend)} // Call onConfirm and pass the newFriend data
            disabled={!newFriend.name || !newFriend.accountNumber} // Disable if name or account number is empty
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors shadow-md ${
              !newFriend.name || !newFriend.accountNumber
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            Confirm Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
