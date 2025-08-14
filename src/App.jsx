import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerificationPage from "./pages/VerificationPage";
import AccountPage from "./pages/AccountPage";
import TransferPage from "./pages/TransferPage";
import SettingsPage from "./pages/SettingPage";
import Header from "./components/Header";
import NavigationTabs from "./components/Navigation";
import AddCardModal from "./components/AddCardModal";
import DeleteCardModal from "./components/DeleteCardModal";
import AddFriendModal from "./components/AddFriendModal";
import HelpVideoModal from "./components/HelpVideoModal"; // Changed from HelpVideoModal to HelpModal for consistency
import CustomerChatModal from "./components/CustomerChat";
import axios from "axios";
import API_BASE_URL from "./config"; // Ensure API_BASE_URL is imported from src/config.js

function App() {
  // --- Global State Management ---
  // Determine initial page based on token in localStorage
  const [user, setUser] = useState(null); // Stores logged-in user information
  const [token, setToken] = useState(localStorage.getItem("userToken") || null); // Stores JWT Token
  const [currentPage, setCurrentPage] = useState(token ? "main" : "login"); // Page to display: 'login', 'signup', 'main', 'verification'

  const [loginData, setLoginData] = useState({ account: "", password: "" });
  const [signupData, setSignupData] = useState({
    accountName: "",
    accountId: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Card data and transaction records will now be fetched from the backend
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [friends, setFriends] = useState([]); // Friends data to be fetched from backend if API is available

  const [activeTab, setActiveTab] = useState("account");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Card management related states
  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);

  // Transaction filtering states
  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Transfer related states
  const [transferType, setTransferType] = useState("");
  const [selectedFromCard, setSelectedFromCard] = useState("");
  const [selectedToCard, setSelectedToCard] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [strangerAccount, setStrangerAccount] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: "", accountNumber: "" });

  // Security settings related states
  const [cardsLocked, setCardsLocked] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Help Center related states
  const [showHelp, setShowHelp] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hello! I am here to help you with your banking questions. How can I assist you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // --- Helper Function: Generic API Request Headers ---
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
      },
    };
  };

  // --- Post-Login/Registration Handling ---
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData); // Set user data in state
    setToken(userToken); // Set token in state
    localStorage.setItem("userToken", userToken); // Store token in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData)); // Store user object in localStorage
    setCurrentPage("main"); // Navigate to main application page
    setActiveTab("account"); // Set active tab to 'account'
    fetchCards(); // Fetch cards immediately after successful login
    fetchTransactions(); // Fetch transactions
    // If you have a backend API for friends, call fetchFriends() here too
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userToken"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user data from localStorage
    setCards([]); // Clear cards data
    setTransactions([]); // Clear transactions data
    setCurrentPage("login"); // Redirect to login page
  };

  // --- Backend Data Fetching Functions ---
  const fetchCards = async () => {
    if (!token) return; // Don't fetch if no token is available
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/cards`,
        getAuthHeaders()
      );
      setCards(data); // Update cards state with data from backend
    } catch (error) {
      console.error(
        "Error fetching cards:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        handleLogout(); // If token is invalid/expired, force logout
      }
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      // Pass query parameters for filtering based on current dateFilter and typeFilter
      const params = { dateFilter, typeFilter };
      const { data } = await axios.get(`${API_BASE_URL}/transactions`, {
        ...getAuthHeaders(),
        params,
      });
      setTransactions(data); // Update transactions state with data from backend
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Add Card function, now making a POST request to the backend
  const addCard = async (newCardData) => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/cards`,
        newCardData,
        getAuthHeaders()
      );
      setCards([...cards, data]); // Add new card received from backend to local state
      setShowAddCard(false);
      alert("Card added successfully!");
    } catch (error) {
      console.error(
        "Error adding card:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to add card."
      );
      if (error.response && error.response.status === 401) handleLogout();
    }
  };

  // Delete Card function, now making a DELETE request to the backend
  const deleteCard = async (cardId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`, getAuthHeaders());
      setCards(cards.filter((card) => card._id !== cardId)); // Filter out the deleted card (use _id from MongoDB)
      setShowDeleteCard(false);
      setDeleteCardId(null);
      alert("Card deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting card:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to delete card."
      );
      if (error.response && error.response.status === 401) handleLogout();
    }
  };

  // addFriend function (currently mocked, will need backend API integration later)
  const addFriend = (friendData) => {
    // This is still mocked as backend API for friends management isn't implemented yet
    const newFriend = { ...friendData, id: friends.length + 1 };
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
    alert("Friend added successfully!");
  };

  // Effect hook: Fetch data when component mounts or token/currentPage/filters change
  useEffect(() => {
    if (token && currentPage === "main") {
      fetchCards();
      fetchTransactions();
      // fetchUserProfile(); // Optional: Fetch user profile data
      // fetchFriends(); // Optional: Fetch friends data if backend API is available
    }
  }, [token, currentPage, dateFilter, typeFilter]); // Re-fetch transactions when filters change

  // Generate Random Password (remains in App.jsx as SettingsPage needs it)
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Send Chat Message (simulated auto-response)
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const newMessages = [
        ...chatMessages,
        { type: "user", message: chatInput },
        {
          type: "bot",
          message:
            "Thank you for your message. Our customer service team will help you with this inquiry. For immediate assistance, please call our 24/7 helpline.",
        },
      ];
      setChatMessages(newMessages);
      setChatInput("");
    }
  };

  // --- Page Rendering Logic ---
  if (currentPage === "login") {
    return (
      <LoginPage
        setCurrentPage={setCurrentPage}
        loginData={loginData}
        setLoginData={setLoginData}
        onLoginSuccess={handleLoginSuccess} // Pass success callback to LoginPage
      />
    );
  }

  if (currentPage === "signup" && !showVerification) {
    return (
      <SignupPage
        setCurrentPage={setCurrentPage}
        signupData={signupData}
        setSignupData={setSignupData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        // handleSignup logic is now handled internally by SignupPage
      />
    );
  }

  if (showVerification) {
    return (
      <VerificationPage
        verificationEmail={verificationEmail}
        setVerificationEmail={setVerificationEmail}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        handleVerification={() => {
          // Verification logic, simulate login and call handleLoginSuccess if successful
          // In a real app, this would also interact with the backend
          alert("Verification successful! You can now log in.");
          setCurrentPage("login"); // After verification, return to login page
          setShowVerification(false);
        }}
        setShowVerification={setShowVerification}
      />
    );
  }

  // Main application page (after successful login)
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header
        setShowHelp={setShowHelp}
        setShowChat={setShowChat}
        handleLogout={handleLogout}
      />{" "}
      {/* Pass handleLogout */}
      <NavigationTabs
        setCurrentPage={setCurrentPage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === "account" && (
          <AccountPage
            cards={cards} // Now dynamically fetched from backend
            transactions={transactions} // Now dynamically fetched from backend
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            setShowAddCard={setShowAddCard}
            setShowDeleteCard={setShowDeleteCard}
            setDeleteCardId={setDeleteCardId}
          />
        )}

        {activeTab === "transfer" && (
          <TransferPage
            transferType={transferType}
            setTransferType={setTransferType}
            cards={cards}
            friends={friends}
            setFriends={setFriends}
            selectedFromCard={selectedFromCard}
            setSelectedFromCard={setSelectedFromCard}
            selectedToCard={selectedToCard}
            setSelectedToCard={setSelectedToCard}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            strangerAccount={strangerAccount}
            setStrangerAccount={setStrangerAccount}
            showAddFriend={showAddFriend}
            setShowAddFriend={setShowAddFriend}
            newFriend={newFriend}
            setNewFriend={setNewFriend}
            addFriend={addFriend}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPage
            cardsLocked={cardsLocked}
            setCardsLocked={setCardsLocked}
            showPasswordChange={showPasswordChange}
            setShowPasswordChange={setShowPasswordChange}
            generateRandomPassword={generateRandomPassword}
          />
        )}
      </div>
      {/* Modals are rendered here */}
      <AddCardModal
        show={showAddCard}
        onClose={() => setShowAddCard(false)}
        onConfirm={addCard} // Passes new card data to App.jsx's addCard function
        currentCardCount={cards.length}
      />
      <DeleteCardModal
        show={showDeleteCard}
        onClose={() => {
          setShowDeleteCard(false);
          setDeleteCardId(null);
        }}
        onConfirm={() => deleteCard(deleteCardId)}
        cards={cards}
        setDeleteCardId={setDeleteCardId}
        deleteCardId={deleteCardId}
      />
      <AddFriendModal
        show={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onConfirm={addFriend}
        newFriend={newFriend}
        setNewFriend={setNewFriend}
      />
      <HelpVideoModal show={showHelp} onClose={() => setShowHelp(false)} />
      <CustomerChatModal
        show={showChat}
        onClose={() => setShowChat(false)}
        messages={chatMessages}
        input={chatInput}
        setInput={setChatInput}
        onSend={sendChatMessage}
      />
    </div>
  );
}

export default App;
