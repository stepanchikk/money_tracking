const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Підключено: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Помилка підключення до БД: ${error.message}`);
        
        if (error.message.includes('Authentication failed')) {
            console.error('Порада: Перевірте логін та пароль у файлі .env');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('Порада: Перевірте, чи не блокує брандмауер (firewall) доступ до Atlas');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;