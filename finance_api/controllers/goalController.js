const Goal = require('../models/goal');

// Отримати всі цілі
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні цілей', error: error.message });
    }
};

// Створити ціль
exports.createGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;

        if (!name || !targetAmount) {
            return res.status(400).json({ message: 'Назва та сума цілі є обов\'язковими' });
        }

        const goal = await Goal.create({
            user: req.user._id,
            name,
            targetAmount,
            deadline
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні цілі', error: error.message });
    }
};

// Оновити ціль (наприклад, змінити суму або назву)
exports.updateGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { name, targetAmount, deadline },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ message: 'Ціль не знайдено' });
        }

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні цілі', error: error.message });
    }
};

// Видалити ціль
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!goal) {
            return res.status(404).json({ message: 'Ціль не знайдено' });
        }

        res.status(200).json({ message: 'Ціль видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні цілі', error: error.message });
    }
};
