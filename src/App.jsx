import React, { useState, useEffect } from "react";
// 导入 useNavigate
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
  const [friends, setFriends] = useState([]);

  const [activeTab, setActiveTab] = useState("account");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);

  const [dateFilter, setDateFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // ✨ 新增状态：用于在 AccountPage 中按卡片筛选交易
  const [selectedCardIdForTransactions, setSelectedCardIdForTransactions] =
    useState(null);

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
    fetchTransactions(); // 登录成功后获取所有交易
    fetchFriends();
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setCards([]);
    setTransactions([]);
    setFriends([]);
    setSelectedCardIdForTransactions(null); // 登出时清除卡片筛选状态
    setCurrentPage("login");
  };

  // --- 新增: 处理注册逻辑的函数 ---
  const handleSignup = async (signupData) => {
    console.log("Sending signup data:", signupData);
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (signupData.password.length < 10) {
      alert("Password must be at least 10 characters long.");
      return;
    }

    try {
      const payload = {
        accountName: signupData.accountName,
        accountId: signupData.accountId,
        password: signupData.password,
        email: signupData.email,
        phone: signupData.phone,
      };
      // 向后端发送注册请求
      await axios.post(`${API_BASE_URL}/auth/signup`, payload);
      alert(
        "Signup successful! Please check your email for a verification code."
      );
      setShowVerification(true); // 显示验证页面
      setVerificationEmail(signupData.email); // 设置验证邮件
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Signup failed. Please try again."
      );
    }
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

  // ✨ 修改：fetchTransactions 现在接受一个可选的 cardId 参数
  const fetchTransactions = async (cardId = null) => {
    if (!token) return;
    try {
      const params = { dateFilter, typeFilter };
      if (cardId) {
        // 如果传入了 cardId，则添加到查询参数中
        params.cardId = cardId;
      }
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

  const addCard = async (newCardData) => {
    if (!token) return;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/cards`,
        newCardData,
        getAuthHeaders()
      );
      setCards([...cards, data]);
      setShowAddCard(false);
      alert("Card added successfully!");
      fetchCards();
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

  const deleteCard = async (cardId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`, getAuthHeaders());
      setCards(cards.filter((card) => card._id !== cardId));
      setShowDeleteCard(false);
      setDeleteCardId(null);
      alert("Card deleted successfully!");
      fetchCards();
      fetchTransactions(); // 卡片删除后刷新交易记录
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

  const addFriend = async (friendData) => {
    if (!token) return;
    try {
      const payload = {
        friendIdentifier: friendData.accountNumber,
        name: friendData.name,
        shortCode: friendData.shortCode,
      };
      const config = getAuthHeaders();
      const { data } = await axios.post(
        `${API_BASE_URL}/friends`,
        payload,
        config
      );

      fetchFriends();
      setNewFriend({ name: "", accountNumber: "", shortCode: "" });
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
  // ✨ 修改：useEffect 现在监听 dateFilter, typeFilter, selectedCardIdForTransactions
  useEffect(() => {
    if (token && currentPage === "main") {
      fetchCards();
      // 在这里不再直接调用 fetchTransactions，因为它的调用现在由 AccountPage 内部的 useEffect 管理
      fetchFriends();
    }
  }, [token, currentPage]); // dateFilter, typeFilter, selectedCardIdForTransactions 放在 AccountPage 的 useEffect 中

  // Generate random password
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Send chat message
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
        // ✨ 将新的 handleSignup 函数作为 prop 传递
        handleSignup={handleSignup}
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
            transactions={transactions} // 将原始交易记录传递给 AccountPage
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            setShowAddCard={setShowAddCard}
            setShowDeleteCard={setShowDeleteCard}
            setDeleteCardId={setDeleteCardId}
            fetchCards={fetchCards}
            fetchTransactions={fetchTransactions} // 传递 fetchTransactions 函数
            // ✨ 传递新的状态和设置函数给 AccountPage
            selectedCardIdForTransactions={selectedCardIdForTransactions}
            setSelectedCardIdForTransactions={setSelectedCardIdForTransactions}
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
            recipientShortCode={recipientShortCode}
            setRecipientShortCode={setRecipientShortCode}
            showAddFriend={showAddFriend}
            setShowAddFriend={setShowAddFriend}
            newFriend={newFriend}
            setNewFriend={setNewFriend}
            addFriend={addFriend}
            fetchCards={fetchCards}
            fetchTransactions={fetchTransactions}
            fetchFriends={fetchFriends}
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
