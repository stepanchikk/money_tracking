const express = require('express');
const { 
    getAccounts, 
    createAccount, 
    getAccountById, 
    updateAccount, 
    deleteAccount 
} = require('../controllers/accountController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Керування банківськими рахунками
 */

router.use(protect);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Отримати всі рахунки користувача
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список рахунків
 *   post:
 *     summary: Створити новий рахунок
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Рахунок створено
 */
router.route('/')
    .get(getAccounts)
    .post(createAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Отримати рахунок за ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Дані рахунку
 *   put:
 *     summary: Оновити рахунок
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               balance:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Рахунок оновлено
 *   delete:
 *     summary: Видалити рахунок
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Рахунок видалено
 */
router.route('/:id')
    .get(getAccountById)
    .put(updateAccount)
    .delete(deleteAccount);

module.exports = router;
