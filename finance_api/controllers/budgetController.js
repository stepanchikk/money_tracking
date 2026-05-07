const Budget = require('../models/budget');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');

// Отримати всі бюджети користувача
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).populate('category', 'name');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні бюджетів', error: error.message });
    }
};

// Створити бюджет
exports.createBudget = async (req, res) => {
    try {
        const { category, amountLimit, startDate, endDate } = req.body;

        if (!category || !amountLimit || !startDate || !endDate) {
            return res.status(400).json({ message: 'Всі поля (категорія, ліміт, дати) є обов\'язковими' });
        }

        const budget = await Budget.create({
            user: req.user._id,
            category,
            amountLimit,
            startDate,
            endDate
        });

        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні бюджету', error: error.message });
    }
};

// Перевірити виконання бюджету
exports.checkBudgetStatus = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id }).populate('category', 'name');
        
        if (!budget) {
            return res.status(404).json({ message: 'Бюджет не знайдено' });
        }

        // Рахуємо фактичні витрати за період бюджету в цій категорії
        const expenses = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id),
                    category: new mongoose.Types.ObjectId(budget.category._id),
                    type: 'expense',
                    date: { $gte: budget.startDate, $lte: budget.endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: { $toDouble: '$amount' } }
                }
            }
        ]);

        const totalSpent = expenses.length > 0 ? expenses[0].totalSpent : 0;
        const limit = parseFloat(budget.amountLimit.toString());

        res.status(200).json({
            budget,
            totalSpent,
            remaining: limit - totalSpent,
            isExceeded: totalSpent > limit
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при перевірці статусу бюджету', error: error.message });
    }
};

// Видалити бюджет
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!budget) {
            return res.status(404).json({ message: 'Бюджет не знайдено' });
        }

        res.status(200).json({ message: 'Бюджет видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні бюджету', error: error.message });
    }
};
