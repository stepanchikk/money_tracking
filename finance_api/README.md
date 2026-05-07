# Finance API Documentation

## Основні можливості
- 🔐 **Автентифікація**: Реєстрація та вхід з використанням JWT токенів.
- 💳 **Рахунки**: Створення декількох рахунків (картки, готівка) з власними балансами.
- 💸 **Транзакції**: Доходи, витрати та перекази між рахунками з автоматичним оновленням балансу.
- 📊 **Звіти**: Аналітика витрат за категоріями та періодами.
- 📅 **Бюджети**: Встановлення лімітів на витрати по категоріях.
- 🎯 **Цілі**: Відстеження фінансових цілей.

## Ендпоінти (Endpoints)

### Автентифікація
- `POST /api/auth/register` - Реєстрація (username, email, password)
- `POST /api/auth/login` - Вхід (email, password)

### Рахунки (Accounts) - [Auth Required]
- `GET /api/accounts` - Отримати всі рахунки
- `POST /api/accounts` - Створити рахунок (name, balance, currency)
- `PUT /api/accounts/:id` - Оновити рахунок
- `DELETE /api/accounts/:id` - Видалити рахунок

### Категорії (Categories) - [Auth Required]
- `GET /api/categories` - Отримати категорії (системні + власні)
- `POST /api/categories` - Створити категорію (name, type: 'income'|'expense', icon)
- `PUT /api/categories/:id` - Оновити
- `DELETE /api/categories/:id` - Видалити

### Транзакції (Transactions) - [Auth Required]
- `GET /api/transactions` - Список транзакцій (фільтри: type, startDate, endDate, category, account)
- `POST /api/transactions` - Створити (account, toAccount, category, type, amount, description, date)
- `DELETE /api/transactions/:id` - Видалити (баланс рахунку повертається)

### Бюджети (Budgets) - [Auth Required]
- `GET /api/budgets` - Список бюджетів
- `POST /api/budgets` - Створити ліміт (category, amountLimit, startDate, endDate)
- `GET /api/budgets/:id` - Перевірити статус виконання ліміту

### Звіти (Reports) - [Auth Required]
- `GET /api/reports/summary?startDate=...&endDate=...` - Загальна аналітика

## Як запустити
1. Встановити залежності: `npm install`
2. Налаштувати `.env` (MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN)
3. Запустити: `npm run dev` (для розробки) або `npm start`
