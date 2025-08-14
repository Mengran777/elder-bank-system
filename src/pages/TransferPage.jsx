import React from "react";
import { CreditCard, Users, User, ArrowLeftRight } from "lucide-react"; // 导入转账页面所需的图标

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
  showAddFriend,
  setShowAddFriend,
  newFriend,
  setNewFriend,
  addFriend,
}) => {
  // 模拟转账逻辑
  const handleTransfer = () => {
    if (!selectedFromCard || !transferAmount) {
      alert("Please select a 'From Account' and enter an amount.");
      return;
    }

    // Use card._id here
    const fromCard = cards.find((card) => card._id === selectedFromCard);
    if (!fromCard || fromCard.balance < parseFloat(transferAmount)) {
      alert("Insufficient balance or invalid 'From Account'.");
      return;
    }

    if (transferType === "self" && !selectedToCard) {
      alert("Please select a 'To Account'.");
      return;
    } else if (transferType === "friends" && !selectedFriend) {
      alert("Please select a friend.");
      return;
    } else if (transferType === "others" && !strangerAccount) {
      alert("Please enter a stranger's account number.");
      return;
    }

    // 这里可以添加更复杂的转账逻辑，例如更新卡的余额
    alert(
      `Transfer of $${parseFloat(transferAmount).toFixed(
        2
      )} successful from Account ${fromCard.accountNumber}!`
    );
    // 实际应用中会更新cards state
    // const updatedCards = cards.map(card => {
    //   if (card._id === selectedFromCard) { // Use _id
    //     return { ...card, balance: card.balance - parseFloat(transferAmount) };
    //   }
    //   if (transferType === 'self' && card._id === selectedToCard) { // Use _id
    //     return { ...card, balance: card.balance + parseFloat(transferAmount) };
    //   }
    //   return card;
    // });
    // setCards(updatedCards);

    // 重置转账表单
    setSelectedFromCard("");
    setSelectedToCard("");
    setTransferAmount("");
    setSelectedFriend("");
    setStrangerAccount("");
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
            onClick={() => setTransferType("self")}
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
            onClick={() => setTransferType("friends")}
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
            onClick={() => setTransferType("others")}
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
                      {" "}
                      {/* Use card._id */}
                      Account {card.accountNumber} - $
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
                    .filter((card) => card._id !== selectedFromCard) // Use card._id
                    .map((card) => (
                      <option key={card._id} value={card._id}>
                        {" "}
                        {/* Use card._id */}
                        Account {card.accountNumber} - $
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
                      {" "}
                      {/* Use card._id */}
                      Account {card.accountNumber} - $
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
                    <option key={friend.id} value={friend.id}>
                      {friend.name} - {friend.accountNumber}
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
                      {" "}
                      {/* Use card._id */}
                      Account {card.accountNumber} - $
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
