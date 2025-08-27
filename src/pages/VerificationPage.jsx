import React from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate

const VerificationPage = ({
  verificationEmail,
  setVerificationEmail,
  verificationCode,
  setVerificationCode,
  handleVerification, // App.jsx 传递下来的验证处理函数
  setShowVerification, // 允许验证页面控制自身的显示状态
}) => {
  const navigate = useNavigate(); // 获取 navigate 函数

  const onConfirmVerification = () => {
    handleVerification(); // 调用 App.jsx 传递下来的验证处理函数
  };

  const onCancelVerification = () => {
    setShowVerification(false); // 隐藏验证模态框
    navigate("/signup"); // 如果用户取消，导航回注册页
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Account Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please follow the steps to verify your account.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 space-y-6">
          <div className="mb-6">
            <p className="text-blue-900 font-semibold mb-2">
              1. Enter your email and send the verification code.
            </p>
            <p className="text-blue-900 font-semibold mb-2">
              2. The verification code will be sent to your email. Please check
              it.
            </p>
            <p className="text-blue-900 font-semibold mb-4">
              3. Enter the verification code here.
            </p>
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
              value={verificationEmail}
              onChange={(e) => setVerificationEmail(e.target.value)}
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 hover:bg-blue-700 transition-colors shadow-md">
              SEND
            </button>
          </div>
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-blue-900 font-semibold mb-2"
            >
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Enter the verification code"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onConfirmVerification}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              CONFIRM
            </button>
            <button
              onClick={onCancelVerification} // 允许用户返回注册页
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

export default VerificationPage;
