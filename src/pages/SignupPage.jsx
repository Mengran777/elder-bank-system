import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate

const SignupPage = ({
  signupData,
  setSignupData,
  handleSignup,
  showPassword,
  setShowPassword,
}) => {
  // 移除 setCurrentPage prop
  const navigate = useNavigate(); // 获取 navigate 函数

  const handleSignupClick = () => {
    handleSignup(); // 调用 App.jsx 传递下来的注册处理函数
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Create a New Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please complete all your information.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 space-y-6">
          <div>
            <label
              htmlFor="accountName"
              className="block text-blue-900 font-semibold mb-2"
            >
              Account Name
            </label>
            <input
              id="accountName"
              type="text"
              placeholder="Enter your account name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signupData.accountName}
              onChange={(e) =>
                setSignupData({ ...signupData, accountName: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="accountId"
              className="block text-blue-900 font-semibold mb-2"
            >
              Account ID
            </label>
            <input
              id="accountId"
              type="text"
              placeholder="Choose your preferred Account ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signupData.accountId}
              onChange={(e) =>
                setSignupData({ ...signupData, accountId: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-blue-900 font-semibold mb-2"
            >
              Password (at least 10 characters)
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-blue-900 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-blue-900 font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-blue-900 font-semibold mb-2"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={signupData.phone}
              onChange={(e) =>
                setSignupData({ ...signupData, phone: e.target.value })
              }
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSignupClick} // 调用处理函数
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              CONFIRM
            </button>
            <button
              onClick={() => navigate("/login")} // 使用 navigate 跳转到登录页
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
