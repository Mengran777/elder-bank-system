import React, { useState, useEffect } from "react"; // 导入 useEffect
import { X } from "lucide-react"; // 导入模态框关闭图标

const AddCardModal = ({ show, onClose, onConfirm, currentCardCount }) => {
  // 模态框内部的状态，用于管理表单输入
  const [newCard, setNewCard] = useState({
    accountNumber: "",
    cardId: "",
    shortCode: "",
    name: "",
    openingBank: "",
    pin: "",
    type: "debit", // 默认值
    expiresEnd: "",
  });

  // ✨ 新增：在模态框显示时重置表单状态
  useEffect(() => {
    if (show) {
      // 当模态框显示时
      setNewCard({
        // 将表单字段重置为初始空值
        accountNumber: "",
        cardId: "",
        shortCode: "",
        name: "",
        openingBank: "",
        pin: "",
        type: "debit",
        expiresEnd: "",
      });
    }
  }, [show]); // 仅当 'show' prop 改变时运行此 effect

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    // 简单的表单验证
    if (Object.values(newCard).some((x) => x === "" || x === null)) {
      alert("Please fill in all the card details.");
      return;
    }
    onConfirm(newCard); // 调用父组件的onConfirm方法，并传递新卡片数据
    // 确认后清空表单（此逻辑已存在，但配合 useEffect 确保每次打开都是新的）
    setNewCard({
      accountNumber: "",
      cardId: "",
      shortCode: "",
      name: "",
      openingBank: "",
      pin: "",
      type: "debit",
      expiresEnd: "",
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-blue-900 mb-4">Add New Card</h3>
        <p className="text-gray-700 mb-6">
          Please finish information, it is very simple.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-gray-800 font-semibold mb-2"
              >
                Account Number:
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.accountNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="shortCode"
                className="block text-gray-800 font-semibold mb-2"
              >
                Short Code:
              </label>
              <input
                type="text"
                id="shortCode"
                name="shortCode"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.shortCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="openingBank"
                className="block text-gray-800 font-semibold mb-2"
              >
                Opening Bank:
              </label>
              <input
                type="text"
                id="openingBank"
                name="openingBank"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.openingBank}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-gray-800 font-semibold mb-2"
              >
                Type:
              </label>
              <select
                id="type"
                name="type"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.type}
                onChange={handleInputChange}
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardId"
                className="block text-gray-800 font-semibold mb-2"
              >
                Card ID:
              </label>
              <input
                type="text"
                id="cardId"
                name="cardId"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.cardId}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-800 font-semibold mb-2"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="pin"
                className="block text-gray-800 font-semibold mb-2"
              >
                PIN:
              </label>
              <input
                type="password"
                id="pin"
                name="pin"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.pin}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="expiresEnd"
                className="block text-gray-800 font-semibold mb-2"
              >
                Expires End:
              </label>
              <input
                type="text" // 方便用户输入 'MM/YY' 格式
                id="expiresEnd"
                name="expiresEnd"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.expiresEnd}
                onChange={handleInputChange}
                placeholder="MM/YY"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between space-x-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md text-lg font-bold"
          >
            CONFIRM
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm text-lg font-bold"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
