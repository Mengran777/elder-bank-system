import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, XCircle } from "lucide-react"; // 导入 XCircle 图标

const AccountPage = ({
  cards,
  transactions, // 接收 App.jsx 传递过来的原始交易记录 (现在应该是后端已过滤好的)
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  setShowAddCard,
  setShowDeleteCard,
  setDeleteCardId,
  // fetchCards, // 传递获取函数，以便在卡片操作后刷新数据 (App.jsx 管理)
  fetchTransactions, // 传递获取函数，以便在交易筛选后刷新数据 (由 App.jsx 传入并执行后端调用)
  // ✨ 新增：用于按卡片筛选交易的状态和设置函数
  selectedCardIdForTransactions,
  setSelectedCardIdForTransactions,
}) => {
  // 确保在组件内部，当筛选条件或卡片选择改变时，重新获取交易
  // 这个 useEffect 负责触发 App.jsx 中的 fetchTransactions，将所有筛选参数传给后端
  useEffect(() => {
    fetchTransactions(selectedCardIdForTransactions);
  }, [
    dateFilter,
    typeFilter,
    selectedCardIdForTransactions,
    fetchTransactions,
  ]); // 确保 fetchTransactions 在依赖数组中

  // 清除卡片筛选
  const handleClearCardFilter = () => {
    setSelectedCardIdForTransactions(null); // 将卡片ID设置为null，表示不按卡片筛选
  };

  // ✨ 关键修正：移除本地的 filteredTransactions 变量和其过滤逻辑
  //    transactions prop 应该已经是 App.jsx 通过后端 API 过滤后的最终结果。

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          Account Information
        </h2>
        <p className="text-gray-600 mb-4">
          Please do not disclose your personal information to anyone.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-blue-900">My Card</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddCard(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus size={16} />
              <span>ADD CARD</span>
            </button>
            <button
              onClick={() => setShowDeleteCard(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Trash2 size={16} />
              <span>DELETE CARD</span>
            </button>
          </div>
        </div>

        {/* 卡片显示 */}
        <div className="space-y-4 mb-8">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card._id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <CreditCard className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-blue-900">
                    Account {card.accountNumber}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-inner">
                    <div className="mb-2">
                      <span className="text-sm opacity-80">Balance</span>
                      <div className="text-2xl font-bold">
                        £
                        {card.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="opacity-80">Cardholder</div>
                        <div className="font-semibold">{card.holder}</div>
                      </div>
                      <div>
                        <div className="opacity-80">Expires End</div>
                        <div className="font-semibold">{card.expires}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg tracking-wider">
                        {card.number}
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-6 h-4 bg-white bg-opacity-30 rounded"></div>
                        <div className="w-6 h-4 bg-white bg-opacity-50 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold capitalize">
                        {card.type}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Account Number:</span>
                      <div>{card.accountNumber}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Short code:</span>
                      <div>{card.shortCode}</div>
                    </div>
                    <div>
                      <span className="font-semibold">Opening bank:</span>
                      <div>{card.bank}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCardIdForTransactions(card._id)} // ✨ 点击时设置选中的卡片ID
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Check Transaction
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-4">
              No cards added yet. Click "Add Card" to get started!
            </p>
          )}
        </div>

        {/* 交易历史 */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-900">
              TRANSACTION HISTORY
            </h3>
            {selectedCardIdForTransactions && ( // ✨ 只有当有卡片筛选时才显示清除按钮
              <button
                onClick={handleClearCardFilter}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors shadow-sm flex items-center space-x-1 text-sm"
              >
                <XCircle size={16} />
                <span>Show All Transactions</span>
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            You can quickly search for it through the filtering function.
          </p>

          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div>
              <span className="font-semibold text-gray-800 mr-2">
                Date Range:
              </span>
              <div className="flex flex-wrap gap-2">
                {["ALL", "7 days", "1 month", "1 year"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className={`px-3 py-1 rounded-full border transition-colors shadow-sm ${
                      dateFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-800 mr-2">Type:</span>
              <div className="flex flex-wrap gap-2">
                {["ALL", "Money-in", "Money-out"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTypeFilter(filter)}
                    className={`px-3 py-1 rounded-full border transition-colors shadow-sm ${
                      typeFilter === filter
                        ? "bg-blue-600 text-white"
                        : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? ( // ✨ 直接使用 transactions prop
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* 根据 amount 判断类型，因为后端现在只返回 'debit'/'credit' */}
                        {transaction.amount > 0 ? "Money-in" : "Money-out"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}£
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
