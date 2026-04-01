# RGIT ATM Machine 🏧

A beautiful, modern ATM machine simulator built with Flask (Python) and vanilla JavaScript. Features a realistic ATM interface with multiple accounts and comprehensive transaction management.

## ✨ Features

### User Features
- **Multi-Account Support**: Multiple demo accounts to test
- **Secure Authentication**: Card number + PIN verification with account lockout after 3 attempts
- **Check Balance**: View current account balance with account details
- **Withdraw Cash**: 
  - Quick withdrawal buttons (₹500, ₹1000, ₹2000, ₹5000)
  - Custom amount entry with validation
- **Deposit Money**: Add funds to your account
- **Fast Cash**: Quick withdrawal presets for faster transactions
- **Transaction History**: View last 10 transactions with details
  - Transaction type (Withdrawal/Deposit)
  - Timestamp
  - Amount and balance after each transaction
- **Change PIN**: Securely update your account PIN
- **Account Information**: View detailed account information including account holder name, account number, status, and balance
- **Professional UI**: Modern, responsive design with smooth animations

### Demo Accounts
Three demo accounts are available for testing:

| Card Number | PIN | Name | Initial Balance |
|-------------|-----|------|-----------------|
| 1234 | 1234 | Soumit Das | ₹5,000 |
| 5678 | 5678 | Aditya Bendal | ₹8,500 |
| 9012 | 9012 | Piyush Dhamale | ₹12,000 |

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- Flask library

### Installation

1. **Navigate to the project folder**
```bash
cd c:\Users\Soumit\OneDrive\Desktop\ATM
```

2. **Install Flask** (if not already installed)
```bash
pip install flask
```

3. **Run the Flask server**
```bash
python app.py
```

4. **Open in your browser**
Navigate to: `http://localhost:5000`

## 🎮 How to Use

1. **Login**
   - Enter Card Number: `1234` (or another demo card)
   - Enter PIN: `1234`
   - Click "Login"

2. **Main Menu**
   - Choose any transaction from the 6 menu options
   - Each option opens a dedicated screen

3. **Withdraw Cash**
   - Click quick buttons or enter custom amount
   - Amount must be in multiples of ₹100
   - Minimum ₹100

4. **Deposit Money**
   - Enter the amount to deposit
   - Amount must be in multiples of ₹100

5. **Check Balance**
   - View your current balance and account number
   - Go back to menu anytime

6. **Transaction History**
   - View your last 10 transactions
   - Shows date, type, amount, and balance after each transaction

7. **Change PIN**
   - Enter current PIN
   - Enter new PIN (must be 4 digits)
   - Confirm new PIN

8. **Account Information**
   - View account holder name
   - View account number
   - View current balance
   - Check account status
   - View account type and branch details

9. **Exit**
   - Log out and return to login screen

## 📁 Project Structure

```
ATM/
├── app.py           # Flask backend with all API endpoints
├── index.html       # Main HTML structure
├── script.js        # Frontend JavaScript logic
├── style.css        # Modern styling and animations
└── README.md        # This file
```

## 🔧 Backend API Endpoints

- `POST /login` - Authenticate user with card number and PIN
- `GET /balance` - Get current account balance
- `POST /withdraw` - Withdraw money from account
- `POST /deposit` - Deposit money to account
- `GET /statements` - Get transaction history
- `POST /change_pin` - Change account PIN
- `POST /logout` - Logout from current session

## 🎨 Design Highlights

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive**: Works on desktop and tablet devices
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Clear labels and error messages
- **Security**: PIN masking, account locking after failed attempts
- **User Feedback**: Success/error messages for all operations
- **Realistic ATM Feel**: Includes keyboard panel, status lights, and physical ATM styling

## 🛡️ Security Features

- PIN masking (shows dots instead of numbers)
- Account lockout after 3 failed login attempts
- Session management
- Amount validation
- Multiple account segregation

## ⚙️ Customization

You can easily customize:

### Add New Accounts
Edit `app.py` in the `users_db` dictionary:
```python
users_db = {
    "1234": {"pin": "1234", "balance": 5000, "name": "Soumit Das", "account_no": "1001"},
    "5678": {"pin": "5678", "balance": 8500, "name": "Aditya Bendal", "account_no": "1002"},
    "9012": {"pin": "9012", "balance": 12000, "name": "Piyush Dhamale", "account_no": "1003"},
}
```

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #1e40af;
    --success-color: #10b981;
    --danger-color: #ef4444;
}
```

### Modify Quick Cash Amounts
Update the buttons in HTML or the `quickWithdraw()` function in JavaScript

## 📊 Transaction Management

- All transactions are tracked in the `transactions` dictionary
- Each transaction stores:
  - Date and time
  - Transaction type (Withdrawal/Deposit)
  - Amount
  - Balance after transaction
- Last 10 transactions are kept per account

## 🐛 Troubleshooting

**Port Already in Use**
If port 5000 is in use, modify `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

**Flask Not Found**
Make sure Flask is installed:
```bash
pip install flask
```

**CORS Issues**
If accessing from a different domain, consider adding Flask-CORS:
```bash
pip install flask-cors
```

## 🚀 Future Enhancements

- Database integration (SQLite, MySQL)
- PIN encryption and hashing
- Transaction export to PDF
- Mobile responsiveness
- QR code support
- Multiple currency support
- ATM network simulation

## 📝 License

This project is free to use and modify for educational purposes.

## 👨‍💻 Developer Notes

- Built with Flask microframework
- Vanilla JavaScript (no frameworks for simplicity)
- Pure CSS animations (no dependencies)
- Responsive design with CSS Grid and Flexbox
- RESTful API architecture

---

**Enjoy your ATM Simulator!** 🎉

For issues or improvements, feel free to modify and enhance the code!