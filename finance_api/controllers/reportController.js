const Transaction = require('../models/transaction');
const mongoose = require('mongoose');

// Отримати звіт за період
exports.getSummaryReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Потрібно вказати startDate та endDate' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchStage = {
            user: new mongoose.Types.ObjectId(req.user._id),
            date: { $gte: start, $lte: end }
        };

        // Загальні доходи та витрати
        const stats = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: { $toDouble: '$amount' } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Розподіл по категоріях
        const categoryStats = await Transaction.aggregate([
            { $match: { ...matchStage, type: { $ne: 'transfer' } } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: { $toDouble: '$amount' } },
                    type: { $first: '$type' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { 
                $unwind: {
                    path: '$categoryInfo',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $project: {
                    categoryName: { $ifNull: ['$categoryInfo.name', 'Без категорії'] },
                    total: 1,
                    type: 1
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json({
            period: { start, end },
            summary: stats,
            byCategory: categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при генерації звіту', error: error.message });
    }
};
