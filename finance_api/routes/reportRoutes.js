const express = require('express');
const { getSummaryReport } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Генерація фінансових звітів
 */

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Отримати звіт за період
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Початкова дата (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Кінцева дата (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Зведені дані про доходи, витрати та категорії
 */
router.get('/summary', protect, getSummaryReport);

module.exports = router;
