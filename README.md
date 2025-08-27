**Elder Bank Management System**

This is a simplified banking management system designed for elderly users, offering core functionalities such as account management, fund transfers, and security settings.

**🚀 Features**

- **User Authentication**:
  - **Register**: New users can register for an account with simulated email verification.
  - **Login**: Registered users can log in using their Account ID and password.
- **Account & Card Management**:
  - **Card Overview**: View details of all added bank cards, including balance, cardholder, card number, and expiry date.
  - **Add Card**: Users can add new bank cards (simulated).
  - **Delete Card**: Users can select and delete linked bank cards.
- **Transaction History**:
  - **Transaction Log**: View all historical transaction records, including date, description, type, and amount.
  - **Filtering**: Supports filtering transactions by date range (All, 7 days, 1 month, 1 year) and transaction type (All, Money-in, Money-out).
- **Fund Transfers**:
  - **Multiple Transfer Types**: Supports transfers to your own other accounts, added friends, or external unfamiliar accounts.
  - **Simplified Operations**: No need to enter a Short Code when transferring to yourself or friends; it's only required for transfers to others.
- **Security Settings**:
  - **Card Lock/Unlock**: Users can easily lock or unlock all their bank cards for enhanced security.
  - **Password Change**: Users can change their account password and generate a strong random password.
- **Help & Support**:
  - **Guide Videos**: Provides relevant operational guide videos based on the current page (Account, Transfer, Settings) (shown with placeholders).
  - **Customer Chat**: Offers a simulated customer service chat function to answer user queries.
- **Currency Display**: All amounts are displayed in British Pounds (£).

**🛠️ Tech Stack**

**Frontend**

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building responsive designs.
- **Axios**: A Promise-based HTTP client for interacting with backend APIs.
- **Lucide React**: A clean and simple icon library for React.

**Backend**

- **Node.js**: A JavaScript runtime environment.
- **Express.js**: A fast, open-source, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing user, card, and transaction data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB in Node.js.
- **bcryptjs**: Used for password hashing and validation.
- **jsonwebtoken**: Used for generating and verifying JSON Web Tokens (JWT) for user authentication.
- **dotenv**: For loading environment variables.

**📋 Environment Setup**

Before starting the project, please ensure your development environment meets the following requirements:

**Prerequisites**

- **Node.js**: v14 or higher (LTS version recommended).
- **npm** (Node Package Manager): Usually installed with Node.js.
- **MongoDB**: A running MongoDB instance (either locally installed or a cloud service like MongoDB Atlas).

**Step 1: Clone Repositories & Install Dependencies**

1. **Clone Repository**:

```
 git clone &lt;your-frontend-repo-url&gt;
```

```
\# In the project root directory

cd elder-bank-system

npm install

cd server # navigate back to root then into the backend folder

npm install
```

**Step 2: Backend Environment Variables Configuration**

1. Create a .env file in the server directory.
2. Add the following environment variables:
3. NODE_ENV=development
4. PORT=5000
5. MONGO_URI=mongodb://localhost:27017/elderbank # Replace with your MongoDB connection string
6. JWT_SECRET=your_jwt_secret_key_here # Replace with a strong random string
   - MONGO_URI: Your MongoDB database connection string. If you're using MongoDB Atlas, get it from your Atlas console.
   - JWT_SECRET: A secret key used for signing JWTs. Please use a sufficiently long and complex random string for security.

**▶️ Project Launch**

**1\. Start the Backend Server**

Navigate to the server directory and run:

```
cd server

npm run dev # Use nodemon for development, auto-restarts on file changes

\# or

npm start # Just starts the server

```

You should see output similar to Server running in development mode on port 5000 and MongoDB Connected: &lt;your_mongodb_host&gt;.

**2\. Start the Frontend Development Server**

Navigate to the project root directory (elder-bank-frontend) and run:

npm run dev

The frontend application will typically start on <http://localhost:5173> (or another port) and automatically open in your browser.

**💡 Simple Feature Overview**

1. **Registration and Login**:
   - Upon opening the application, you'll first see the login page. You can click "create a new account" to register.
   - When registering, please fill in your Account Name, Account ID, password, email, and phone. The password must be at least 10 characters long.
   - After successful registration, a simulated verification page will be displayed.
   - After registering and (simulated) verifying, return to the login page and use your Account ID and password to log in.
2. **Account Page**:
   - After logging in, you'll be directed to the "Account" page by default.
   - This page displays your bank card information and transaction history.
   - Click "ADD CARD" to add a new card (simulated data).
   - Click "DELETE CARD" to select and remove a card.
   - The transaction history section supports filtering by date and type.
3. **Transfer Page**:
   - Click "Transfer" in the navigation bar to go to the transfer page.
   - Select a transfer type: "To my account" (transfer to your other accounts), "To my friends" (transfer to an added friend), or "To others" (transfer to an external, unfamiliar account).
   - Fill in the relevant transfer information based on the selected type. Note that Short Code is not required for transfers to friends or your own accounts.
   - After entering the amount, click "TRANSFER" to complete the transfer.
4. **Settings Page**:
   - Click "Setting" in the navigation bar to go to the settings page.
   - **Card Security**: Click the "LOCKED" / "UNLOCKED" button to toggle the lock status of all your bank cards.
   - **Change Password**: You can enter your current password, new password, and confirm the new password to change your account password. There's also a "Generate Random" button to generate a strong random password.
5. **Help & Support**:
   - Click "WATCH GUIDE VIDEO" or "ASK FOR" / "HELP" buttons in the top right corner of the page to access guide videos or customer chat.

**❓ Troubleshooting**

- **Blank Page or Cannot Connect to Backend**:
  - Ensure the backend server is running correctly and that PORT and MONGO_URI in .env are configured properly.
  - Check if the frontend's API_BASE_URL (usually in src/config.js) points to the correct backend address (defaults to <http://localhost:5000/api>).
  - Check your browser's console for any CORS errors. Ensure your backend's app.js has correct CORS configuration to allow your frontend's origin.
- **Tailwind CSS Not Applied**:
  - Ensure the content path in tailwind.config.js correctly includes all your frontend files containing Tailwind classes.
  - Verify that postcss.config.js exists and is correctly configured.
  - Confirm that src/index.css contains the @tailwind directives and that this CSS file is imported in src/main.jsx.

Thank you for using the Elder Bank Management System!
