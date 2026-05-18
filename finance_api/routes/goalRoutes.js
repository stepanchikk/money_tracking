const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal, addFunds } = require('../controllers/goalController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Керування фінансовими цілями
 */

router.use(protect);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Отримати всі цілі
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список цілей
 *   post:
 *     summary: Створити нову ціль
 *     tags: [Goals]
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
 *               - targetAmount
 *             properties:
 *               name:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Ціль створено
 */
router.route('/')
    .get(getGoals)
    .post(createGoal);

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Оновити ціль
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
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
 *               targetAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Ціль оновлено
 *   delete:
 *     summary: Видалити ціль
 *     tags: [Goals]
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
 *         description: Ціль видалено
 */
router.route('/:id')
    .put(updateGoal)
    .delete(deleteGoal);

/**
 * @swagger
 * /api/goals/{id}/add-funds:
 *   post:
 *     summary: Додати кошти до цілі
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Кошти додано
 */
router.post('/:id/add-funds', addFunds);

module.exports = router;
