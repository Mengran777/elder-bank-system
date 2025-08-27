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
import HelpVideoModal from "./components/HelpVideoModal";
import CustomerChatModal from "./components/CustomerChat";
import axios from "axios";
import API_BASE_URL from "./config";

function App() {
  // --- Global State Management ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [currentPage, setCurrentPage] = useState(token ? "main" : "login");

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

  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [friends, setFriends] = useState([]); // Friends data now fetched from backend

  const [activeTab, setActiveTab] = useState("account");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);

  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [transferType, setTransferType] = useState("");
  const [selectedFromCard, setSelectedFromCard] = useState("");
  const [selectedToCard, setSelectedToCard] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [strangerAccount, setStrangerAccount] = useState("");
  const [recipientShortCode, setRecipientShortCode] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: "",
    accountNumber: "",
    shortCode: "",
  });

  const [cardsLocked, setCardsLocked] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

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

  // Helper function: Common API request headers
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- Login/Logout handlers ---
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("userToken", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("main");
    setActiveTab("account");
    fetchCards();
    fetchTransactions();
    fetchFriends(); // Fetch friends after successful login
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setCards([]);
    setTransactions([]);
    setFriends([]); // Clear friends on logout
    setCurrentPage("login");
  };

  // --- Backend data fetching functions ---
  const fetchCards = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/cards`,
        getAuthHeaders()
      );
      setCards(data);
    } catch (error) {
      console.error(
        "Error fetching cards:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const params = { dateFilter, typeFilter };
      const { data } = await axios.get(`${API_BASE_URL}/transactions`, {
        ...getAuthHeaders(),
        params,
      });
      setTransactions(data);
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

  // Fetch friends list from backend
  const fetchFriends = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/friends`,
        getAuthHeaders()
      );
      setFriends(data);
    } catch (error) {
      console.error(
        "Error fetching friends:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Add a new card (calls backend API)
  const addCard = async (newCardData) => {
    if (!token) return;
    try {
      // payload will be newCardData directly as fields are now unified
      const { data } = await axios.post(
        `${API_BASE_URL}/cards`,
        newCardData,
        getAuthHeaders()
      );
      setCards([...cards, data]); // Add new card to state
      setShowAddCard(false);
      alert("Card added successfully!");
      fetchCards(); // Refresh cards list to get latest data
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

  // Delete a card (calls backend API)
  const deleteCard = async (cardId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`, getAuthHeaders());
      setCards(cards.filter((card) => card._id !== cardId)); // Filter out deleted card
      setShowDeleteCard(false);
      setDeleteCardId(null);
      alert("Card deleted successfully!");
      fetchCards(); // Refresh cards list to get latest data
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

  // Add friend (calls backend API)
  const addFriend = async (friendData) => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/friends`,
        friendData,
        getAuthHeaders()
      );
      fetchFriends(); // Refresh friends list after adding
      setNewFriend({ name: "", accountNumber: "", shortCode: "" }); // Clear form
      setShowAddFriend(false);
      alert(data.message);
    } catch (error) {
      console.error(
        "Error adding friend:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to add friend."
      );
      if (error.response && error.response.status === 401) handleLogout();
    }
  };

  // Effect hook: Fetch data on component load or token/currentPage/filter changes
  useEffect(() => {
    if (token && currentPage === "main") {
      fetchCards();
      fetchTransactions();
      fetchFriends(); // Fetch friends data when main page is active
    }
  }, [token, currentPage, dateFilter, typeFilter]);

  // Generate random password (used in SettingsPage)
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Send chat message (simulated auto-reply)
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
        onLoginSuccess={handleLoginSuccess}
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
          alert("Verification successful! You can now log in.");
          setCurrentPage("login");
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
      />
      <NavigationTabs
        setCurrentPage={setCurrentPage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="max-w-6xl mx-auto p-6">
        {activeTab === "account" && (
          <AccountPage
            cards={cards}
            transactions={transactions.filter((transaction) => {
              const transactionDate = new Date(
                transaction.createdAt || transaction.date
              ); // Use createdAt from backend, fallback to date
              const now = new Date();
              let dateMatch = true;

              if (dateFilter === "7 days") {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(now.getDate() - 7);
                dateMatch = transactionDate >= sevenDaysAgo;
              } else if (dateFilter === "1 month") {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(now.getMonth() - 1);
                dateMatch = transactionDate >= oneMonthAgo;
              } else if (dateFilter === "1 year") {
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(now.getFullYear() - 1);
                dateMatch = transactionDate >= oneYearAgo;
              }

              const typeMatch =
                typeFilter === "ALL" ||
                (typeFilter === "Money-in" && transaction.amount > 0) ||
                (typeFilter === "Money-out" && transaction.amount < 0);

              return dateMatch && typeMatch;
            })} // Filter transactions
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            setShowAddCard={setShowAddCard}
            setShowDeleteCard={setShowDeleteCard}
            setDeleteCardId={setDeleteCardId}
            fetchCards={fetchCards} // Pass fetch function so AccountPage can trigger refresh
            fetchTransactions={fetchTransactions} // Pass fetch function
          />
        )}

        {activeTab === "transfer" && (
          <TransferPage
            transferType={transferType}
            setTransferType={setTransferType}
            cards={cards}
            friends={friends}
            setFriends={setFriends} // Keeping for now, might be needed if TransferPage manages friend state directly for some reason
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
            recipientShortCode={recipientShortCode}
            setRecipientShortCode={setRecipientShortCode}
            showAddFriend={showAddFriend}
            setShowAddFriend={setShowAddFriend}
            newFriend={newFriend}
            setNewFriend={setNewFriend}
            addFriend={addFriend}
            fetchCards={fetchCards} // Pass fetch functions to TransferPage
            fetchTransactions={fetchTransactions}
            fetchFriends={fetchFriends} // Pass fetchFriends to TransferPage
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
      {/* Modals rendered here */}
      <AddCardModal
        show={showAddCard}
        onClose={() => setShowAddCard(false)}
        onConfirm={addCard}
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
