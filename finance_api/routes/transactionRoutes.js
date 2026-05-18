const express = require('express');
const { 
    createTransaction, 
    getTransactions, 
    deleteTransaction,
    updateTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Керування фінансовими операціями (доходи, витрати, перекази)
 */

router.use(protect);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Отримати всі транзакції
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Початкова дата (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Кінцева дата (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, transfer]
 *         description: Тип транзакції
 *       - in: query
 *         name: account
 *         schema:
 *           type: string
 *         description: ID рахунку
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID категорії
 *     responses:
 *       200:
 *         description: Список транзакцій
 *   post:
 *     summary: Створити нову транзакцію
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - type
 *               - amount
 *             properties:
 *               account:
 *                 type: string
 *               toAccount:
 *                 type: string
 *                 description: Тільки для переказів
 *               category:
 *                 type: string
 *                 description: Не використовується для переказів
 *               type:
 *                 type: string
 *                 enum: [income, expense, transfer]
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Транзакцію створено
 */
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Оновити транзакцію
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Транзакцію оновлено
 *   delete:
 *     summary: Видалити транзакцію
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Транзакцію видалено
 */
router.route('/:id')
    .put(updateTransaction)
    .delete(deleteTransaction);


module.exports = router;
