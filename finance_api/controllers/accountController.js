const Account = require('../models/account');

// Отримати всі рахунки користувача
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user._id });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні рахунків', error: error.message });
    }
};

// Створити новий рахунок
exports.createAccount = async (req, res) => {
    try {
        const { name, balance, currency } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Назва рахунку є обов\'язковою' });
        }

        const account = await Account.create({
            user: req.user._id,
            name,
            balance: balance || 0,
            currency: currency || 'UAH'
        });

        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні рахунку', error: error.message });
    }
};

// Отримати один рахунок
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!account) {
            return res.status(404).json({ message: 'Рахунок не знайдено' });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні рахунку', error: error.message });
    }
};

// Оновити рахунок
exports.updateAccount = async (req, res) => {
    try {
        const { name, balance, currency } = req.body;
        
        let account = await Account.findOne({ _id: req.params.id, user: req.user._id });

        if (!account) {
            return res.status(404).json({ message: 'Рахунок не знайдено' });
        }

        account.name = name || account.name;
        account.balance = balance !== undefined ? balance : account.balance;
        account.currency = currency || account.currency;

        const updatedAccount = await account.save();
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні рахунку', error: error.message });
    }
};

// Видалити рахунок
exports.deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!account) {
            return res.status(404).json({ message: 'Рахунок не знайдено' });
        }

        res.status(200).json({ message: 'Рахунок видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні рахунку', error: error.message });
    }
};
