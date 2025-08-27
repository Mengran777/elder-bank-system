import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate

const LoginPage = ({ loginData, setLoginData, handleLogin }) => {
  // 移除 setCurrentPage prop
  const navigate = useNavigate(); // 获取 navigate 函数

  const handleLoginClick = () => {
    handleLogin(); // 调用 App.jsx 传递下来的登录处理函数
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <span
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              {" "}
              {/* 使用 navigate 跳转到注册页 */}
              create a new account
            </span>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 space-y-6">
          <div>
            <label htmlFor="account" className="sr-only">
              Account
            </label>
            <input
              id="account"
              name="account"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg"
              placeholder="Account ID"
              value={loginData.account}
              onChange={(e) =>
                setLoginData({ ...loginData, account: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              onClick={handleLoginClick} // 调用处理函数
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <User
                  className="h-5 w-5 text-blue-300 group-hover:text-blue-200"
                  aria-hidden="true"
                />
              </span>
              LOG IN
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/signup")} // 使用 navigate 跳转到注册页
              className="w-full mt-4 border-2 border-blue-600 text-blue-600 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <User size={20} />
              <span>SIGN UP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
