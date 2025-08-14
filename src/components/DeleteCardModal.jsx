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
  // 使用 card._id 来查找卡片
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
          {cardToDelete ? (
            <span className="font-semibold">
              Card ending in: {cardToDelete.number.slice(-4)}
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
            // 将 value={deleteCardId || ""} 中的 deleteCardId 转换为字符串，因为 select 的 value 始终是字符串
            value={deleteCardId || ""}
            // onChange 中将值转换为数字是错误的，因为 _id 是字符串。
            // 应该直接传递字符串值给 setDeleteCardId。
            onChange={(e) => setDeleteCardId(e.target.value)}
          >
            <option value="">-- Select a card --</option>
            {cards.map((card) => (
              <option key={card._id} value={card._id}>
                {" "}
                {/* 使用 card._id 作为 key 和 value */}
                Account {card.accountNumber} ({card.number}) - $
                {card.balance.toLocaleString()}
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
            onClick={onConfirm}
            // 只有当选中了卡片时才启用确认按钮
            disabled={!deleteCardId}
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
