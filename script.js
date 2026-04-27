// Global state
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 3;

// Show specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen-view').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        
        // Load data for specific screens
        if (screenId === 'balance-screen') {
            loadBalance();
        } else if (screenId === 'statement-screen') {
            loadStatements();
        } else if (screenId === 'print-receipt-screen') {
            loadPrintableStatements();
        }
        
        // Clear messages
        clearMessages();
    }
}

// Login functionality
function login() {
    const cardNo = document.getElementById('card-no').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const errorDiv = document.getElementById('login-error');
    
    if (!cardNo || !pin) {
        errorDiv.textContent = 'Please enter Card Number and PIN';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (cardNo.length !== 4 || pin.length !== 4) {
        errorDiv.textContent = 'Card Number and PIN must be 4 digits';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Call backend login API
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            card_no: cardNo,
            pin: pin
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loginAttempts = 0;
            document.getElementById('user-name').textContent = `Welcome, ${data.name}!`;
            document.getElementById('card-no').value = '';
            document.getElementById('pin').value = '';
            errorDiv.style.display = 'none';
            showScreen('menu-screen');
            // Add subtle animation
            document.getElementById('menu-screen').style.animation = 'slideIn 0.3s ease-in-out';
        } else {
            loginAttempts++;
            errorDiv.textContent = data.message || 'Invalid Card Number or PIN';
            errorDiv.style.display = 'block';
            
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                errorDiv.textContent = '❌ Too many failed attempts. Card has been blocked.';
                document.getElementById('card-no').disabled = true;
                document.getElementById('pin').disabled = true;
                document.querySelector('button[onclick="login()"]').disabled = true;
                setTimeout(() => location.reload(), 5000);
            }
        }
    })
    .catch(error => {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    });
}

// Load and display balance
function loadBalance() {
    fetch('/balance', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('display-balance').textContent = `₹ ${data.balance.toLocaleString('en-IN')}`;
            document.getElementById('display-account').textContent = `Account: ${data.account_no}`;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Withdraw money
function withdraw() {
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    const errorDiv = document.getElementById('withdraw-error');
    const successDiv = document.getElementById('withdraw-success');
    
    if (!amount || amount <= 0) {
        errorDiv.textContent = '❌ Please enter a valid amount';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    if (amount % 100 !== 0) {
        errorDiv.textContent = '❌ Amount must be in multiples of ₹100';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            successDiv.innerHTML = `
                <div class="receipt">
                    <i class="fas fa-check-circle"></i>
                    <p>${data.message}</p>
                    <p>New Balance: <strong>₹ ${data.balance.toLocaleString('en-IN')}</strong></p>
                </div>
            `;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            document.getElementById('withdraw-amount').value = '';
            
            // Auto-return to menu after 3 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
                showScreen('menu-screen');
            }, 3000);
        } else {
            errorDiv.textContent = `❌ ${data.message}`;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    })
    .catch(error => {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    });
}

// Deposit money
function deposit() {
    const amount = parseInt(document.getElementById('deposit-amount').value);
    const errorDiv = document.getElementById('deposit-error');
    const successDiv = document.getElementById('deposit-success');
    
    if (!amount || amount <= 0) {
        errorDiv.textContent = '❌ Please enter a valid amount';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    if (amount % 100 !== 0) {
        errorDiv.textContent = '❌ Amount must be in multiples of ₹100';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    fetch('/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: amount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            successDiv.innerHTML = `
                <div class="receipt">
                    <i class="fas fa-check-circle"></i>
                    <p>${data.message}</p>
                    <p>New Balance: <strong>₹ ${data.balance.toLocaleString('en-IN')}</strong></p>
                </div>
            `;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            document.getElementById('deposit-amount').value = '';
            
            // Auto-return to menu after 3 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
                showScreen('menu-screen');
            }, 3000);
        } else {
            errorDiv.textContent = `❌ ${data.message}`;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    })
    .catch(error => {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    });
}

// Quick withdrawal (Fast Cash)
function quickWithdraw(amount) {
    document.getElementById('withdraw-amount').value = amount;
    withdraw();
}

// Load transaction statements
function loadStatements() {
    fetch('/statements', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statementList = document.getElementById('statement-list');
        
        if (data.status === 'success' && data.transactions.length > 0) {
            let html = '<div class="transactions-container">';
            data.transactions.reverse().forEach((transaction, index) => {
                const icon = transaction.type === 'Withdrawal' ? 
                    '<i class="fas fa-money-bill-wave"></i>' : 
                    '<i class="fas fa-piggy-bank"></i>';
                const colorClass = transaction.type === 'Withdrawal' ? 'withdraw' : 'deposit';
                
                html += `
                    <div class="transaction-item ${colorClass}">
                        <div class="transaction-icon">${icon}</div>
                        <div class="transaction-details">
                            <div class="transaction-type">${transaction.type}</div>
                            <div class="transaction-date">${transaction.date}</div>
                        </div>
                        <div class="transaction-amount">
                            ${transaction.type === 'Withdrawal' ? '-' : '+'}₹${transaction.amount.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div class="transaction-balance">Balance: ₹${transaction.balance.toLocaleString('en-IN')}</div>
                `;
            });
            html += '</div>';
            statementList.innerHTML = html;
        } else {
            statementList.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-inbox"></i>
                    <p>No transactions yet</p>
                </div>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Change PIN
function changePIN() {
    const oldPin = document.getElementById('old-pin').value;
    const newPin = document.getElementById('new-pin').value;
    const confirmPin = document.getElementById('confirm-pin').value;
    const errorDiv = document.getElementById('pin-error');
    const successDiv = document.getElementById('pin-success');
    
    if (!oldPin || !newPin || !confirmPin) {
        errorDiv.textContent = '❌ Please fill all fields';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    if (newPin !== confirmPin) {
        errorDiv.textContent = '❌ New PIN and confirm PIN do not match';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    if (newPin.length !== 4 || oldPin.length !== 4) {
        errorDiv.textContent = '❌ PIN must be 4 digits';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }
    
    fetch('/change_pin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            old_pin: oldPin,
            new_pin: newPin
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            successDiv.innerHTML = `
                <div class="receipt">
                    <i class="fas fa-check-circle"></i>
                    <p>✓ PIN changed successfully</p>
                </div>
            `;
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            
            document.getElementById('old-pin').value = '';
            document.getElementById('new-pin').value = '';
            document.getElementById('confirm-pin').value = '';
            
            setTimeout(() => {
                successDiv.style.display = 'none';
                showScreen('menu-screen');
            }, 2000);
        } else {
            errorDiv.textContent = `❌ ${data.message}`;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    })
    .catch(error => {
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    });
}

// Logout
function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('user-name').textContent = '';
        showScreen('login-screen');
        clearMessages();
        document.getElementById('card-no').disabled = false;
        document.getElementById('pin').disabled = false;
        document.querySelector('button[onclick="login()"]').disabled = false;
    })
    .catch(error => console.error('Error:', error));
}

// Clear all messages
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => {
        el.style.display = 'none';
    });
}

// Allow Enter key to submit login
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const activeScreen = document.querySelector('.screen-view.active');
        if (activeScreen && activeScreen.id === 'login-screen') {
            login();
        }
    }
});

// Load transaction statements for printing
function loadPrintableStatements() {
    fetch('/statements', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statementList = document.getElementById('print-statement-list');
        
        if (data.status === 'success' && data.transactions.length > 0) {
            let html = '<div class="transactions-container">';
            data.transactions.reverse().forEach((transaction, index) => {
                const icon = transaction.type === 'Withdrawal' ? 
                    '<i class="fas fa-money-bill-wave"></i>' : 
                    '<i class="fas fa-piggy-bank"></i>';
                const colorClass = transaction.type === 'Withdrawal' ? 'withdraw' : 'deposit';
                
                html += `
                    <div class="transaction-item ${colorClass}">
                        <div class="transaction-icon">${icon}</div>
                        <div class="transaction-details">
                            <div class="transaction-type">${transaction.type}</div>
                            <div class="transaction-date">${transaction.date}</div>
                        </div>
                        <div class="transaction-amount">
                            ${transaction.type === 'Withdrawal' ? '-' : '+'}₹${transaction.amount.toLocaleString('en-IN')}
                        </div>
                        <button class="btn-print-receipt" title="Print Receipt" onclick="printTransactionReceipt('${transaction.type}', '${transaction.date}', ${transaction.amount}, ${transaction.balance})">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                `;
            });
            html += '</div>';
            statementList.innerHTML = html;
        } else {
            statementList.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-inbox"></i>
                    <p>No transactions available for printing</p>
                </div>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Print Receipt Animation and Download as Image
function printTransactionReceipt(type, date, amount, balance) {
    const paper = document.getElementById('printed-paper-content');
    if(paper) {
        const transId = Math.floor(100000 + Math.random() * 900000);
        paper.innerHTML = `
            <div style="text-align:center; font-weight:bold; font-size: 14px; margin-bottom:4px;">RGIT ATM</div>
            <div style="text-align:center; font-size: 8px; margin-bottom:10px;">Rajiv Gandhi Institute of Technology</div>
            <div style="border-bottom: 1px dashed #000; margin-bottom: 8px;"></div>
            <table style="width: 100%; font-size: 10px; margin-bottom: 5px;">
                <tr><td>Date:</td><td style="text-align:right">${date.split(' ')[0]}</td></tr>
                <tr><td>Time:</td><td style="text-align:right">${date.split(' ')[1]}</td></tr>
                <tr><td>Txn ID:</td><td style="text-align:right">TXN-${transId}</td></tr>
            </table>
            <div style="border-bottom: 1px dashed #000; margin-bottom: 8px;"></div>
            <table style="width: 100%; font-size: 10px; margin-bottom: 5px;">
                <tr><td>Type:</td><td style="text-align:right">${type}</td></tr>
                <tr><td>Amount:</td><td style="text-align:right">₹${amount.toLocaleString('en-IN')}</td></tr>
            </table>
            <div style="border-bottom: 1px dashed #000; margin-bottom: 8px;"></div>
            <div style="font-weight:bold; font-size: 11px; margin-bottom: 5px;">Avail Bal: ₹${balance.toLocaleString('en-IN')}</div>
            <div style="border-bottom: 1px dashed #000; margin-bottom: 10px;"></div>
            <div style="text-align:center; font-size: 9px;">Thank you for banking with us!</div>
            <div style="text-align:center; font-size: 14px; margin-top: 8px; letter-spacing: 2px;">|||||| |||| |||</div>
        `;
    }

    const container = document.getElementById('receipt-output');
    if(container) {
        container.classList.remove('printing');
        void container.offsetWidth; // trigger reflow
        container.classList.add('printing');
        
        setTimeout(() => {
            // Use html2canvas to capture the paper as an image
            if (typeof html2canvas !== 'undefined') {
                html2canvas(paper, {
                    scale: 4, // extremely high resolution
                    backgroundColor: null
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = imgData;
                    a.download = `RGIT_ATM_Receipt_${date.replace(/[: ]/g, '_')}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            } else {
                console.error("html2canvas not loaded");
            }
            
            // Retract after a few seconds
            setTimeout(() => {
                container.classList.remove('printing');
            }, 3000);
        }, 2000);
    }
}