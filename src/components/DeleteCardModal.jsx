import React from "react";
import { X } from "lucide-react"; // 导入模态框关闭图标

const DeleteCardModal = ({
  show,
  onClose,
  onConfirm,
  cards,
  setDeleteCardId,
  deleteCardId,
}) => {
  if (!show) return null;

  // 找到待删除的卡片信息，以便在模态框中显示
  // 使用 `_id` 匹配后端数据，并确保 `card.number` 可用
  const cardToDelete = cards.find((card) => card._id === deleteCardId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-red-700 mb-4">Delete Card</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this card? This action cannot be
          undone.
          <br />
          {/* 显示卡号的最后四位，使用可选链操作符和回退值 */}
          {cardToDelete ? (
            <span className="font-semibold">
              Card ending in: {cardToDelete.number?.slice(-4) || "N/A"}
            </span>
          ) : (
            "Please select a card to delete."
          )}
        </p>

        {/* 选择要删除的卡片下拉框 */}
        <div className="mb-6">
          <label
            htmlFor="deleteCardSelect"
            className="block text-gray-800 font-semibold mb-2"
          >
            Select Card to Delete:
          </label>
          <select
            id="deleteCardSelect"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={deleteCardId || ""} // value 绑定到 deleteCardId
            onChange={(e) => setDeleteCardId(e.target.value)} // setDeleteCardId 接收字符串
          >
            <option value="">-- Select a card --</option>
            {cards.map((card) => (
              // 使用 card._id 作为 key 和 value
              <option key={card._id} value={card._id}>
                Account {card.accountNumber} ({card.number?.slice(-4) || "N/A"})
                - £{card.balance?.toLocaleString() || "0.00"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(deleteCardId)} // 确保传递正确的 deleteCardId
            disabled={!deleteCardId} // 如果没有选中卡片，禁用按钮
            className={`px-6 py-2 bg-red-600 text-white rounded-lg transition-colors shadow-md ${
              !deleteCardId
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
            }`}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardModal;
