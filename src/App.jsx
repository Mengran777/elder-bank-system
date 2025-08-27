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

  // Card and transaction data will now be fetched from the backend
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // Friends data will now be fetched from the backend
  const [friends, setFriends] = useState([]);

  const [activeTab, setActiveTab] = useState("account");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  // deleteCardId 应该是一个字符串，因为它将是 MongoDB 的 _id
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
  // newFriend 的 shortCode 字段是必需的，因为后端 Friends 模型可能需要它
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

  // --- Helper function: Common API request headers ---
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
      // 确保卡片数据至少包含一个 number 字段 (这里使用 cardId 作为 number 的值)
      // 如果后端返回的字段名是 number, 那么这一步可以省略
      const formattedCards = data.map((card) => ({
        ...card,
        // 假设后端返回的 cardId 实际上是完整的卡号
        // 或者如果后端有 'number' 字段，就直接用 'number'
        number: card.number || card.cardId, // 统一使用 'number' 字段
      }));
      setCards(formattedCards);
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

  // Add a new card (calls backend API) - ✨ 关键修改 ✨
  const addCard = async (newCardData) => {
    if (!token) return;
    try {
      // 构造发送到后端的数据，确保字段名与后端模型 (server/models/Card.js) 匹配
      const payload = {
        type: newCardData.type,
        balance: 0, // 新卡初始余额设为0或根据后端逻辑处理
        holder: newCardData.name,
        number: newCardData.cardId, // 将前端 AddCardModal 的 cardId 映射到后端 Card 模型的 number 字段
        expires: newCardData.expires, // 映射 expiresEnd 到 expires
        accountNumber: newCardData.accountNumber,
        shortCode: newCardData.shortCode,
        bank: newCardData.openingBank,
        // pin 不应该直接发送到后端或需要加密处理
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/cards`,
        payload,
        getAuthHeaders()
      );
      // setCards([...cards, data]); // 直接添加后端返回的新卡，它应该包含 _id 和正确的 number 字段
      setShowAddCard(false);
      alert("Card added successfully!");
      fetchCards(); // 刷新卡片列表以获取最新数据，包括正确的 number 字段
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

  // Delete a card (calls backend API) - ✨ 关键修改 ✨
  const deleteCard = async (cardId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`, getAuthHeaders());
      // setCards(cards.filter((card) => card._id !== cardId)); // 过滤本地状态，或直接重新获取
      setShowDeleteCard(false);
      setDeleteCardId(null);
      alert("Card deleted successfully!");
      fetchCards(); // 刷新卡片列表以获取最新数据
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
      const payload = {
        friendIdentifier: friendData.accountNumber, // Backend will use this to find the user
        name: friendData.name, // Frontend display or for future backend use
        shortCode: friendData.shortCode, // Add shortCode to payload if your backend needs it
      };
      const config = getAuthHeaders();
      const { data } = await axios.post(
        `${API_BASE_URL}/friends`,
        payload,
        config
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
      fetchFriends();
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
            })} // 过滤交易记录
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            setShowAddCard={setShowAddCard}
            setShowDeleteCard={setShowDeleteCard}
            setDeleteCardId={setDeleteCardId}
            fetchCards={fetchCards} // 传递 fetch 函数以便 AccountPage 可以触发刷新
            fetchTransactions={fetchTransactions} // 传递 fetch 函数
          />
        )}

        {activeTab === "transfer" && (
          <TransferPage
            transferType={transferType}
            setTransferType={setTransferType}
            cards={cards}
            friends={friends}
            // setFriends={setFriends} // setFriends 可能不需要在这里传递，因为 addFriend 已经通过 prop 传递
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
            addFriend={addFriend} // 传递 addFriend 函数
            fetchCards={fetchCards} // 传递 fetch 函数
            fetchTransactions={fetchTransactions} // 传递 fetch 函数
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
      {/* 模态框统一在此处渲染 */}
      <AddCardModal
        show={showAddCard}
        onClose={() => setShowAddCard(false)}
        onConfirm={addCard} // 传递 addCard 函数
        currentCardCount={cards.length}
      />
      <DeleteCardModal
        show={showDeleteCard}
        onClose={() => {
          setShowDeleteCard(false);
          setDeleteCardId(null);
        }}
        onConfirm={() => deleteCard(deleteCardId)} // 传递 deleteCard 函数
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
