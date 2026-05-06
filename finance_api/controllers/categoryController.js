const Category = require('../models/category');

exports.getCategories = async(req, res) => {
    try {
        const categories = await Category.find({
            $or: [{ user: req.user._id }, { user: null }]
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні категорій', error: error.message });
    }
};

exports.createCategory = async(req, res) => {
    try {
        const { name, type, icon } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Назва та тип категорії є обов\'язковими ' });
        }

        const category = await Category.create({
            user: req.user._id,
            name,
            type,
            icon
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні категорії', error: error.message });
    }
};