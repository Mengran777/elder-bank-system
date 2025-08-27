import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom"; // 导入路由相关组件和钩子
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
  const navigate = useNavigate(); // 用于编程式导航，例如登录成功后跳转
  const location = useLocation(); // 用于获取当前路由信息，例如判断当前激活的标签

  // --- 全局状态管理 ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  // currentPage 状态被 React Router 的路径取代

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

  // 银行卡和交易数据将从后端获取
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // 朋友数据将从后端获取
  const [friends, setFriends] = useState([]);

  // 从当前路由路径推断 activeTab
  const currentPath = location.pathname;
  let activeTabFromPath = "account"; // 默认值
  if (currentPath.includes("/transfer")) {
    activeTabFromPath = "transfer";
  } else if (currentPath.includes("/settings")) {
    activeTabFromPath = "settings";
  } else if (currentPath.includes("/account")) {
    activeTabFromPath = "account";
  }
  const [activeTab, setActiveTab] = useState(activeTabFromPath); // 仍然保留此状态供 NavigationTabs 组件使用

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

  // 当路由路径改变时更新 activeTab 状态
  useEffect(() => {
    setActiveTab(activeTabFromPath);
  }, [location.pathname]); // 依赖 location.pathname，确保路由变化时更新

  // --- 辅助函数：公共 API 请求头 ---
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // --- 登录/登出处理函数 ---
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("userToken", userToken);
    localStorage.setItem("user", JSON.stringify(userData)); // 将用户数据保存到 localStorage
    navigate("/account"); // 登录成功后导航到账户页面
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user"); // 清除 localStorage 中的用户数据
    setCards([]);
    setTransactions([]);
    setFriends([]); // 登出时清除朋友列表
    navigate("/login"); // 登出后导航到登录页面
  };

  // --- 后端数据获取函数 ---
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
        handleLogout(); // 未授权，强制登出
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
        handleLogout(); // 未授权，强制登出
      }
    }
  };

  // 从后端获取朋友列表
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
        handleLogout(); // 未授权，强制登出
      }
    }
  };

  // 添加新银行卡 (调用后端 API)
  const addCard = async (newCardData) => {
    if (!token) return;
    try {
      // 假设 newCardData 包含了所有后端所需的卡片信息
      const { data } = await axios.post(
        `${API_BASE_URL}/cards`,
        newCardData,
        getAuthHeaders()
      );
      // setCards([...cards, data]); // 后端返回新卡片，更新本地状态
      setShowAddCard(false);
      alert("Card added successfully!");
      fetchCards(); // 刷新卡片列表以获取最新数据
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

  // 删除银行卡 (调用后端 API)
  const deleteCard = async (cardId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/cards/${cardId}`, getAuthHeaders());
      // setCards(cards.filter((card) => card._id !== cardId)); // 后端成功删除，更新本地状态
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

  // 添加朋友 (调用后端 API)
  const addFriend = async (friendData) => {
    if (!token) return;
    try {
      const payload = {
        friendIdentifier: friendData.accountNumber, // 后端将使用此字段查找用户
        name: friendData.name, // 前端显示或用于未来后端使用
        // shortCode: friendData.shortCode // 前端显示或用于未来后端使用，根据后端需求决定是否发送
      };
      const config = getAuthHeaders();
      const { data } = await axios.post(
        `${API_BASE_URL}/friends`,
        payload,
        config
      );

      fetchFriends(); // 添加朋友成功后刷新朋友列表
      setNewFriend({ name: "", accountNumber: "", shortCode: "" }); // 清空表单
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

  // 处理 LoginPage 组件的登录提交
  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        accountId: loginData.account,
        password: loginData.password,
      });

      if (response.data && response.data.token) {
        handleLoginSuccess(response.data.user, response.data.token); // 调用成功的处理函数
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Login failed. Please check your credentials."
      );
    }
  };

  // 处理 SignupPage 组件的注册提交
  const handleSignupSubmit = async () => {
    if (
      !signupData.accountName ||
      !signupData.accountId ||
      !signupData.password ||
      !signupData.confirmPassword ||
      !signupData.email ||
      !signupData.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (signupData.password.length < 10) {
      alert("Password must be at least 10 characters long.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        accountName: signupData.accountName,
        accountId: signupData.accountId,
        password: signupData.password,
        email: signupData.email,
        phone: signupData.phone,
      });

      if (response.data) {
        alert("Registration successful! Please proceed to verification."); // 注册成功后提示验证
        setVerificationEmail(signupData.email); // 将注册邮箱传递给验证页面
        setShowVerification(true); // 显示验证页面
        navigate("/verify"); // 导航到验证页面
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Registration failed. Please try again."
      );
    }
  };

  // 处理 VerificationPage 组件的验证提交
  const handleVerificationSubmit = () => {
    // 在真实应用中，您会将验证码发送到后端进行验证
    if (verificationEmail && verificationCode) {
      alert("Verification successful! You can now log in.");
      setShowVerification(false);
      navigate("/login"); // 验证成功后导航到登录页面
    } else {
      alert("Please enter email and verification code.");
    }
  };

  // Effect hook: 在 token 存在时，根据当前路由路径或筛选条件获取数据
  // 这确保了用户登录后或在主要标签页之间导航时数据会刷新
  useEffect(() => {
    if (token) {
      // 只有在 main 区域的路由才触发这些数据的全局获取
      if (
        activeTab === "account" ||
        activeTab === "transfer" ||
        activeTab === "settings"
      ) {
        fetchCards();
        fetchTransactions();
        fetchFriends();
      }
    } else {
      // 如果没有 token，且当前不在登录或注册页面，则重定向到登录页
      if (!["/login", "/signup", "/verify"].includes(location.pathname)) {
        navigate("/login");
      }
    }
  }, [token, activeTab, dateFilter, typeFilter, location.pathname]); // 依赖项包含 location.pathname 以响应路由变化

  // 生成随机密码 (用于 SettingsPage)
  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // 发送聊天消息 (模拟自动回复)
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

  // --- 主要应用布局 & 路由 ---
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* 只有在已登录时才条件性渲染 Header 和 NavigationTabs */}
      {token && (
        <>
          <Header
            setShowHelp={setShowHelp}
            setShowChat={setShowChat}
            handleLogout={handleLogout}
          />
          <NavigationTabs
            activeTab={activeTab} // activeTab 从 App.jsx 的状态传递
            setActiveTab={setActiveTab} // 传递 setActiveTab 允许导航组件更新状态
          />
        </>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          {/* 公开路由 (无需登录即可访问) */}
          <Route
            path="/login"
            element={
              !token ? (
                <LoginPage
                  loginData={loginData}
                  setLoginData={setLoginData}
                  handleLogin={handleLoginSubmit} // 传递 App 级别的登录处理函数
                />
              ) : (
                <Navigate to="/account" replace /> // 如果已登录，重定向到账户页
              )
            }
          />
          <Route
            path="/signup"
            element={
              !token ? (
                <SignupPage
                  signupData={signupData}
                  setSignupData={setSignupData}
                  handleSignup={handleSignupSubmit} // 传递 App 级别的注册处理函数
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              ) : (
                <Navigate to="/account" replace /> // 如果已登录，重定向到账户页
              )
            }
          />
          <Route
            path="/verify"
            element={
              showVerification ? ( // 仅当 showVerification 为 true 时渲染
                <VerificationPage
                  verificationEmail={verificationEmail}
                  setVerificationEmail={setVerificationEmail}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  handleVerification={handleVerificationSubmit} // 传递 App 级别的验证处理函数
                  setShowVerification={setShowVerification} // 允许验证页面控制自身显示状态
                />
              ) : (
                <Navigate to="/signup" replace /> // 如果未显示验证页面，则重定向到注册页
              )
            }
          />

          {/* 保护路由 (需要登录才能访问) */}
          <Route
            path="/account"
            element={
              token ? (
                <AccountPage
                  cards={cards}
                  transactions={transactions} // 传递原始交易记录，过滤逻辑可以在 AccountPage 内部或 App.jsx 预处理
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  setShowAddCard={setShowAddCard}
                  setShowDeleteCard={setShowDeleteCard}
                  setDeleteCardId={setDeleteCardId}
                  fetchCards={fetchCards} // 传递获取函数以便子组件执行刷新操作
                  fetchTransactions={fetchTransactions}
                />
              ) : (
                <Navigate to="/login" replace /> // 未登录则重定向到登录页
              )
            }
          />

          <Route
            path="/transfer"
            element={
              token ? (
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
                  fetchCards={fetchCards} // 传递获取函数以便子组件执行刷新操作
                  fetchTransactions={fetchTransactions}
                />
              ) : (
                <Navigate to="/login" replace /> // 未登录则重定向到登录页
              )
            }
          />

          <Route
            path="/settings"
            element={
              token ? (
                <SettingsPage
                  cardsLocked={cardsLocked}
                  setCardsLocked={setCardsLocked}
                  showPasswordChange={showPasswordChange}
                  setShowPasswordChange={setShowPasswordChange}
                  generateRandomPassword={generateRandomPassword}
                />
              ) : (
                <Navigate to="/login" replace /> // 未登录则重定向到登录页
              )
            }
          />

          {/* 默认路由：如果 URL 不匹配任何定义的路由 */}
          {/* 如果已登录，重定向到 /account；否则重定向到 /login */}
          <Route
            path="*"
            element={<Navigate to={token ? "/account" : "/login"} replace />}
          />
        </Routes>
      </div>

      {/* 模态框在此处渲染 */}
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
        onConfirm={addFriend} // 传递 addFriend 函数
        newFriend={newFriend}
        setNewFriend={setNewFriend}
      />
      <HelpVideoModal
        show={showHelp}
        onClose={() => setShowHelp(false)}
        videoContentKey={activeTab} // 将 activeTab 作为 videoContentKey 传递给 HelpModal
      />
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
