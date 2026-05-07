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

exports.updateCategory = async (req, res) => {
    try {
        const { name, type, icon } = req.body;
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { name, type, icon },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Категорію не знайдено або немає прав доступу' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні категорії', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!category) {
            return res.status(404).json({ message: 'Категорію не знайдено або немає прав доступу' });
        }

        res.status(200).json({ message: 'Категорію видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні категорії', error: error.message });
    }
};