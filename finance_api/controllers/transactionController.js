const Transaction = require('../models/transaction');
const Account = require('../models/account');
const mongoose = require('mongoose');

// Створити транзакцію (дохід, витрата або переказ)
exports.createTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { account, toAccount, category, type, amount, date, description, tags } = req.body;

        if (!account || !type || !amount) {
            return res.status(400).json({ message: 'Рахунок, тип та сума є обов\'язковими' });
        }

        // Перевірка рахунку
        const sourceAccount = await Account.findOne({ _id: account, user: req.user._id }).session(session);
        if (!sourceAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Рахунок не знайдено' });
        }

        // Створення транзакції
        const transaction = await Transaction.create([{
            user: req.user._id,
            account,
            toAccount: type === 'transfer' ? toAccount : null,
            category: type !== 'transfer' ? category : null,
            type,
            amount,
            date: date || Date.now(),
            description,
            tags
        }], { session });

        // Оновлення балансу
        const numAmount = parseFloat(amount.toString());
        
        if (type === 'income') {
            sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) + numAmount;
        } else if (type === 'expense') {
            sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) - numAmount;
        } else if (type === 'transfer') {
            if (!toAccount) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Для переказу потрібен цільовий рахунок' });
            }
            const targetAccount = await Account.findOne({ _id: toAccount, user: req.user._id }).session(session);
            if (!targetAccount) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Цільовий рахунок не знайдено' });
            }

            sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) - numAmount;
            targetAccount.balance = parseFloat(targetAccount.balance.toString()) + numAmount;
            await targetAccount.save({ session });
        }

        await sourceAccount.save({ session });
        await session.commitTransaction();

        res.status(201).json(transaction[0]);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Помилка при створенні транзакції', error: error.message });
    } finally {
        session.endSession();
    }
};

// Отримати всі транзакції з фільтрацією
exports.getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, type, account, category } = req.query;
        let query = { user: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (type) query.type = type;
        if (account) query.account = account;
        if (category) query.category = category;

        const transactions = await Transaction.find(query)
            .populate('account', 'name')
            .populate('toAccount', 'name')
            .populate('category', 'name')
            .sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні транзакцій', error: error.message });
    }
};

// Видалити транзакцію (з поверненням балансу)
exports.deleteTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id }).session(session);
        
        if (!transaction) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Транзакцію не знайдено' });
        }

        const sourceAccount = await Account.findById(transaction.account).session(session);
        const numAmount = parseFloat(transaction.amount.toString());

        // Повертаємо баланс назад
        if (transaction.type === 'income') {
            if (sourceAccount) sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) - numAmount;
        } else if (transaction.type === 'expense') {
            if (sourceAccount) sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) + numAmount;
        } else if (transaction.type === 'transfer') {
            const targetAccount = await Account.findById(transaction.toAccount).session(session);
            if (sourceAccount) sourceAccount.balance = parseFloat(sourceAccount.balance.toString()) + numAmount;
            if (targetAccount) {
                targetAccount.balance = parseFloat(targetAccount.balance.toString()) - numAmount;
                await targetAccount.save({ session });
            }
        }

        if (sourceAccount) await sourceAccount.save({ session });
        await Transaction.deleteOne({ _id: transaction._id }).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Транзакцію видалено, баланс оновлено' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Помилка при видаленні транзакції', error: error.message });
    } finally {
        session.endSession();
    }
};
