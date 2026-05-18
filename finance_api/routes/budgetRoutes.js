const express = require('express');
const { getBudgets, createBudget, checkBudgetStatus, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Керування бюджетами (лімітами витрат)
 */

router.use(protect);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Отримати всі бюджети
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список бюджетів
 *   post:
 *     summary: Створити новий бюджет
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - amountLimit
 *               - startDate
 *               - endDate
 *             properties:
 *               category:
 *                 type: string
 *               amountLimit:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Бюджет створено
 */
router.route('/')
    .get(getBudgets)
    .post(createBudget);

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Перевірити статус бюджету
 *     tags: [Budgets]
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
 *         description: Статус бюджету (витрачено/залишилось)
 *   delete:
 *     summary: Видалити бюджет
 *     tags: [Budgets]
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
 *         description: Бюджет видалено
 */
router.route('/:id')
    .get(checkBudgetStatus)
    .delete(deleteBudget);

module.exports = router;
