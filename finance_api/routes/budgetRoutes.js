const express = require('express');
const { getBudgets, createBudget, checkBudgetStatus, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getBudgets)
    .post(createBudget);

router.route('/:id')
    .get(checkBudgetStatus)
    .delete(deleteBudget);

module.exports = router;
