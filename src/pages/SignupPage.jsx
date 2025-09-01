import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignupPage = ({
  signupData,
  setSignupData,
  handleSignup,
  showPassword,
  setShowPassword,
}) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 客户端验证：检查 accountName 是否为空
    if (!signupData.accountName || signupData.accountName.trim() === "") {
      setErrorMessage("Account name is required.");
      return;
    }

    // 客户端验证：检查密码是否一致
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // 重置错误信息并提交
    setErrorMessage("");
    handleSignup(signupData);
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
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 space-y-6"
        >
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
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
              required
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
              required
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
                required
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
              required
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
              required
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
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              CONFIRM
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
