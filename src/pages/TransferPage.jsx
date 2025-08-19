import React from "react";
import { CreditCard, Users, User, ArrowLeftRight } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../config";

const TransferPage = ({
  transferType,
  setTransferType,
  cards,
  friends,
  setFriends,
  selectedFromCard,
  setSelectedFromCard,
  selectedToCard,
  setSelectedToCard,
  transferAmount,
  setTransferAmount,
  selectedFriend,
  setSelectedFriend,
  strangerAccount,
  setStrangerAccount,
  recipientShortCode,
  setRecipientShortCode,
  showAddFriend,
  setShowAddFriend,
  newFriend,
  setNewFriend,
  addFriend,
  fetchCards,
  fetchTransactions,
}) => {
  const handleTransfer = async () => {
    if (!selectedFromCard || !transferAmount) {
      alert("Please select a 'From Account' and enter an amount.");
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }

    const fromCardDetails = cards.find((card) => card._id === selectedFromCard);
    if (!fromCardDetails || fromCardDetails.balance < amount) {
      alert("Insufficient balance or invalid 'From Account'.");
      return;
    }

    let payload = {
      fromCardId: selectedFromCard,
      transferAmount: amount,
      transferType: transferType,
    };

    if (transferType === "self") {
      if (!selectedToCard) {
        alert("Please select a 'To Account'.");
        return;
      }
      payload.selectedToCardId = selectedToCard;
      // 自我转账不需要 Short Code
    } else if (transferType === "friends") {
      if (!selectedFriend) {
        alert("Please select a friend.");
        return;
      }
      payload.selectedFriendId = selectedFriend;
      // 朋友转账，Short Code 不再是必填项，也不会从前端发送
      // 后端将根据朋友的用户ID查找Short Code
    } else if (transferType === "others") {
      if (!strangerAccount || !recipientShortCode) {
        alert("Please enter recipient's account number and short code.");
        return;
      }
      payload.strangerAccount = strangerAccount;
      payload.recipientShortCode = recipientShortCode; // 陌生人转账 Short Code 必填
    } else {
      alert("Please select a transfer type.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/transactions/transfer`,
        payload,
        config
      );

      alert(response.data.message);

      // Refresh cards and transactions after successful transfer
      fetchCards();
      fetchTransactions();

      // Reset transfer form
      setSelectedFromCard("");
      setSelectedToCard("");
      setTransferAmount("");
      setSelectedFriend("");
      setStrangerAccount("");
      setRecipientShortCode(""); // 重置 Short Code
      setTransferType(""); // Reset transfer type to clear the form
    } catch (error) {
      console.error(
        "Transfer failed:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Transfer failed. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Transfer</h2>
        <p className="text-gray-600 mb-4">
          Please do not readily believe any transfer requests from strangers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-blue-900 mb-6">
          Choose your transfer type
        </h3>

        <div className="space-y-4">
          <button
            onClick={() => {
              setTransferType("self");
              setRecipientShortCode("");
            }}
            className={`w-full p-4 rounded-lg border-2 text-left flex items-center space-x-3 transition-colors shadow-sm ${
              transferType === "self"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <CreditCard className="text-blue-600" size={24} />
            <span className="font-semibold">To my account</span>
          </button>

          <button
            onClick={() => {
              setTransferType("friends");
              setRecipientShortCode("");
            }}
            className={`w-full p-4 rounded-lg border-2 text-left flex items-center space-x-3 transition-colors shadow-sm ${
              transferType === "friends"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Users className="text-blue-600" size={24} />
            <span className="font-semibold">To my friends</span>
          </button>

          <button
            onClick={() => {
              setTransferType("others");
              setRecipientShortCode("");
            }}
            className={`w-full p-4 rounded-lg border-2 text-left flex items-center space-x-3 transition-colors shadow-sm ${
              transferType === "others"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <User className="text-blue-600" size={24} />
            <span className="font-semibold">To others</span>
          </button>
        </div>

        {/* Transfer Forms */}
        {transferType === "self" && (
          <div className="mt-6 p-4 border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-blue-900 mb-4">
              Transfer to my account
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  From Account
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFromCard}
                  onChange={(e) => setSelectedFromCard(e.target.value)}
                >
                  <option value="">Select card</option>
                  {cards.map((card) => (
                    <option key={card._id} value={card._id}>
                      Account {card.accountNumber} - £
                      {card.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  To Account
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedToCard}
                  onChange={(e) => setSelectedToCard(e.target.value)}
                >
                  <option value="">Select card</option>
                  {cards
                    .filter((card) => card._id !== selectedFromCard)
                    .map((card) => (
                      <option key={card._id} value={card._id}>
                        Account {card.accountNumber} - £
                        {card.balance.toLocaleString()}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-semibold text-gray-800 mb-2">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
            <button
              onClick={handleTransfer}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <ArrowLeftRight size={20} />
              <span>TRANSFER</span>
            </button>
          </div>
        )}

        {transferType === "friends" && (
          <div className="mt-6 p-4 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-900">
                Transfer to friends
              </h4>
              <button
                onClick={() => setShowAddFriend(true)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Add Friend
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  From Account
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFromCard}
                  onChange={(e) => setSelectedFromCard(e.target.value)}
                >
                  <option value="">Select your card</option>
                  {cards.map((card) => (
                    <option key={card._id} value={card._id}>
                      Account {card.accountNumber} - £
                      {card.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  To Friend
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFriend}
                  onChange={(e) => setSelectedFriend(e.target.value)}
                >
                  <option value="">Select friend</option>
                  {friends.map((friend) => (
                    <option key={friend._id} value={friend._id}>
                      {friend.name} - {friend.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              {/* Short Code Field for Friends (已移除，后端将从朋友的用户信息中获取) */}
            </div>
            <div className="mt-4">
              <label className="block font-semibold text-gray-800 mb-2">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
            <button
              onClick={handleTransfer}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <ArrowLeftRight size={20} />
              <span>TRANSFER</span>
            </button>
          </div>
        )}

        {transferType === "others" && (
          <div className="mt-6 p-4 border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-blue-900 mb-4">
              Transfer to others
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  From Account
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFromCard}
                  onChange={(e) => setSelectedFromCard(e.target.value)}
                >
                  <option value="">Select your card</option>
                  {cards.map((card) => (
                    <option key={card._id} value={card._id}>
                      Account {card.accountNumber} - £
                      {card.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Recipient Account Number
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient's account number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={strangerAccount}
                  onChange={(e) => setStrangerAccount(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-800 mb-2">
                  Recipient Short Code
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient's short code"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recipientShortCode}
                  onChange={(e) => setRecipientShortCode(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-semibold text-gray-800 mb-2">
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
            <button
              onClick={handleTransfer}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <ArrowLeftRight size={20} />
              <span>TRANSFER</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferPage;
