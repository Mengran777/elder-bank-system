import React from "react";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react"; // 导入设置页面所需的图标

const SettingsPage = ({
  cardsLocked,
  setCardsLocked,
  showPasswordChange,
  setShowPasswordChange,
  generateRandomPassword,
}) => {
  // 临时状态用于密码修改
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [tempShowNewPassword, setTempShowNewPassword] = React.useState(false); // 用于新密码显示/隐藏

  const handleChangePassword = () => {
    // 实际应用中会验证当前密码，并进行后端更新
    if (newPassword.length < 10) {
      alert("New password must be at least 10 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      alert("New password cannot be the same as the current password.");
      return;
    }
    // 模拟密码修改成功
    alert("Password changed successfully!");
    // 重置密码输入框
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordChange(false);
  };

  const handleGenerateAndSetPassword = () => {
    const generated = generateRandomPassword();
    setNewPassword(generated);
    setConfirmNewPassword(generated); // 自动填充确认密码
    alert("Random password generated. Please copy it safely and confirm.");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Settings</h2>
        <p className="text-gray-600 mb-4">
          Manage your account and security preferences.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 space-y-8">
        {/* Card Lock Section */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            Card Security
          </h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
            <span className="font-semibold text-gray-800">Lock My Cards</span>
            <button
              onClick={() => setCardsLocked(!cardsLocked)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md ${
                cardsLocked
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {cardsLocked ? <Lock size={16} /> : <Unlock size={16} />}
              <span>{cardsLocked ? "UNLOCKED" : "LOCKED"}</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {cardsLocked
              ? "Your cards are currently LOCKED. No transactions can be made."
              : "Your cards are currently UNLOCKED. You can perform transactions normally."}
          </p>
        </div>

        {/* Password Change Section */}
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            Change Password
          </h3>
          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              CHANGE PASSWORD
            </button>
          ) : (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-gray-800 font-semibold mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-800 font-semibold mb-2"
                >
                  New Password (at least 10 characters)
                </label>
                <div className="relative">
                  <input
                    type={tempShowNewPassword ? "text" : "password"}
                    id="newPassword"
                    className="w-full p-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setTempShowNewPassword(!tempShowNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {tempShowNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-gray-800 font-semibold mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Confirm Change
                </button>
                <button
                  onClick={handleGenerateAndSetPassword}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                  Generate Random
                </button>
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
