import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Import the close icon for the modal

const AddCardModal = ({ show, onClose, onConfirm }) => {
  // Internal state for the modal to manage form inputs
  const [newCard, setNewCard] = useState({
    accountNumber: "",
    cardId: "", // This will be the 16-digit card number sent to backend as 'number'
    shortCode: "",
    name: "", // Card Holder Name
    openingBank: "",
    pin: "", // PIN for the card (should not be stored directly in backend without encryption)
    type: "debit", // Default card type
    expires: "", // Changed from expiresEnd to expires for consistency with backend model
  });

  // Effect hook to reset form state when the modal is shown
  useEffect(() => {
    if (show) {
      // When the modal is shown
      setNewCard({
        // Reset form fields to initial empty values
        accountNumber: "",
        cardId: "",
        shortCode: "",
        name: "",
        openingBank: "",
        pin: "",
        type: "debit",
        expires: "",
      });
    }
  }, [show]); // Run this effect only when 'show' prop changes

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle confirmation of adding a new card
  const handleConfirm = () => {
    // Simple form validation
    if (
      !newCard.accountNumber ||
      !newCard.cardId ||
      !newCard.shortCode ||
      !newCard.name ||
      !newCard.openingBank ||
      !newCard.pin ||
      !newCard.expires
    ) {
      alert("Please fill in all the card details.");
      return;
    }
    // Card Number validation removed as per user request

    // PIN validation format remains 3 digits
    if (!/^\d{3}$/.test(newCard.pin)) {
      alert("PIN must be 3 digits.");
      return;
    }
    // Validate expiration date format MM/YY
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCard.expires)) {
      alert("Expires End must be in MM/YY format (e.g., 01/25).");
      return;
    }

    onConfirm(newCard); // Call the parent component's onConfirm method, passing the new card data
    // The App.jsx's onConfirm (addCard) will handle closing the modal and refreshing data.
  };

  if (!show) return null; // Do not render if 'show' is false

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
          Please provide the following card information.
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
                placeholder="e.g., 12345678"
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
                placeholder="e.g., 40-17-18"
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
                placeholder="e.g., ELBC London"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-gray-800 font-semibold mb-2"
              >
                Card Type:
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
                Card Number:
              </label>
              <input
                type="text"
                id="cardId"
                name="cardId"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.cardId}
                onChange={handleInputChange}
                // maxLength removed as per user request
                placeholder="e.g., 1234567890123456"
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-gray-800 font-semibold mb-2"
              >
                Card Holder Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.name}
                onChange={handleInputChange}
                placeholder="e.g.,  TAI"
              />
            </div>
            <div>
              <label
                htmlFor="pin"
                className="block text-gray-800 font-semibold mb-2"
              >
                PIN (3 digits):
              </label>
              <input
                type="password"
                id="pin"
                name="pin"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.pin}
                onChange={handleInputChange}
                maxLength="3" // Restrict input length to 3
                placeholder="e.g., 123"
              />
            </div>
            <div>
              <label
                htmlFor="expires"
                className="block text-gray-800 font-semibold mb-2"
              >
                Expires End (MM/YY):
              </label>
              <input
                type="text" // Facilitate 'MM/YY' input format
                id="expires"
                name="expires"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCard.expires}
                onChange={handleInputChange}
                placeholder="e.g., 12/25"
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
