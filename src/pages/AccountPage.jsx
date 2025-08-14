import React from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react"; // 导入账户页面所需的图标

const AccountPage = ({
  cards,
  transactions, // 接收已经过滤好的transactions
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  setShowAddCard,
  setShowDeleteCard,
  setDeleteCardId,
}) => {
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

        {/* Cards Display */}
        <div className="space-y-4 mb-8">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <div
                key={card.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <CreditCard className="text-blue-600 mr-2" size={20} />
                  <span className="font-semibold text-blue-900">
                    Account {index + 1}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-600 text-white p-4 rounded-lg shadow-inner">
                    <div className="mb-2">
                      <span className="text-sm opacity-80">Balance</span>
                      <div className="text-2xl font-bold">
                        $
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
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
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

        {/* Transaction History */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            TRANSACTION HISTORY
          </h3>
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
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.type}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
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
