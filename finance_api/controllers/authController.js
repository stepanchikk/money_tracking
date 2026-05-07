const User = require('../models/user');
const jwt = require('jsonwebtoken');

// допоміжна функція для генерації токена
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// реєстрація нового користувача
exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // перевірка чи існує вже такий email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує ' });
        }

        // створення нового користувача
        const user = await User.create({
            username,
            email,
            passwordHash: password
        });

        //відправка токена і успішної відповіді
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};

// авторизація користувача
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // шукаєм по email
        const user = await User.findOne({ email });

        // якщо користувач є і паролі збігаються
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Невірний email або пароль' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};