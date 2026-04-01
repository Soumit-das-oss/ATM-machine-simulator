from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

# User database with multiple accounts
users_db = {
    "1234": {"pin": "1234", "balance": 5000, "name": "Soumit Das", "account_no": "1001"},
    "5678": {"pin": "5678", "balance": 8500, "name": "Aditya Bendal", "account_no": "1002"},
    "9012": {"pin": "9012", "balance": 12000, "name": "Piyush Dhamale", "account_no": "1003"},
}

# Transaction history for each account
transactions = {
    "1001": [],
    "1002": [],
    "1003": [],
}

# Current session
current_session = {"account_no": None, "account_name": None}

def add_transaction(account_no, transaction_type, amount, balance_after):
    """Add transaction to history"""
    transaction = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "type": transaction_type,
        "amount": amount,
        "balance": balance_after
    }
    if account_no not in transactions:
        transactions[account_no] = []
    transactions[account_no].append(transaction)
    # Keep only last 10 transactions
    if len(transactions[account_no]) > 10:
        transactions[account_no].pop(0)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    card_no = data.get('card_no', '')
    pin = data.get('pin', '')
    
    if card_no in users_db and users_db[card_no]['pin'] == pin:
        current_session['account_no'] = users_db[card_no]['account_no']
        current_session['account_name'] = users_db[card_no]['name']
        return jsonify({
            "status": "success",
            "name": users_db[card_no]['name'],
            "account_no": users_db[card_no]['account_no']
        })
    else:
        return jsonify({"status": "fail", "message": "Invalid Card Number or PIN"})

@app.route('/balance', methods=['GET'])
def get_balance():
    if not current_session['account_no']:
        return jsonify({"status": "fail", "message": "Not logged in"})
    
    account_no = current_session['account_no']
    for card_no, user in users_db.items():
        if user['account_no'] == account_no:
            return jsonify({
                "status": "success",
                "balance": user['balance'],
                "account_no": account_no,
                "name": user['name']
            })
    return jsonify({"status": "fail"})

@app.route('/withdraw', methods=['POST'])
def withdraw():
    if not current_session['account_no']:
        return jsonify({"status": "fail", "message": "Not logged in"})
    
    data = request.json
    amount = int(data.get('amount', 0))
    
    if amount <= 0:
        return jsonify({"status": "fail", "message": "Invalid amount"})
    
    account_no = current_session['account_no']
    
    for card_no, user in users_db.items():
        if user['account_no'] == account_no:
            if amount <= user['balance']:
                user['balance'] -= amount
                add_transaction(account_no, "Withdrawal", amount, user['balance'])
                return jsonify({
                    "status": "success",
                    "balance": user['balance'],
                    "message": f"Withdrawal of ₹{amount} successful"
                })
            else:
                return jsonify({
                    "status": "fail",
                    "message": f"Insufficient balance. Available: ₹{user['balance']}"
                })
    
    return jsonify({"status": "fail", "message": "Account not found"})

@app.route('/deposit', methods=['POST'])
def deposit():
    if not current_session['account_no']:
        return jsonify({"status": "fail", "message": "Not logged in"})
    
    data = request.json
    amount = int(data.get('amount', 0))
    
    if amount <= 0:
        return jsonify({"status": "fail", "message": "Invalid amount"})
    
    account_no = current_session['account_no']
    
    for card_no, user in users_db.items():
        if user['account_no'] == account_no:
            user['balance'] += amount
            add_transaction(account_no, "Deposit", amount, user['balance'])
            return jsonify({
                "status": "success",
                "balance": user['balance'],
                "message": f"Deposit of ₹{amount} successful"
            })
    
    return jsonify({"status": "fail", "message": "Account not found"})

@app.route('/statements', methods=['GET'])
def get_statements():
    if not current_session['account_no']:
        return jsonify({"status": "fail", "message": "Not logged in"})
    
    account_no = current_session['account_no']
    trans_list = transactions.get(account_no, [])
    
    return jsonify({
        "status": "success",
        "transactions": trans_list,
        "account_no": account_no
    })

@app.route('/change_pin', methods=['POST'])
def change_pin():
    if not current_session['account_no']:
        return jsonify({"status": "fail", "message": "Not logged in"})
    
    data = request.json
    old_pin = data.get('old_pin', '')
    new_pin = data.get('new_pin', '')
    
    account_no = current_session['account_no']
    
    for card_no, user in users_db.items():
        if user['account_no'] == account_no:
            if user['pin'] == old_pin:
                user['pin'] = new_pin
                # Update the card number PIN as well
                users_db[card_no]['pin'] = new_pin
                return jsonify({"status": "success", "message": "PIN changed successfully"})
            else:
                return jsonify({"status": "fail", "message": "Incorrect current PIN"})
    
    return jsonify({"status": "fail", "message": "Account not found"})

@app.route('/logout', methods=['POST'])
def logout():
    current_session['account_no'] = None
    current_session['account_name'] = None
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)