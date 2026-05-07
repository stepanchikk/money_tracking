const express = require('express');
const { 
    createTransaction, 
    getTransactions, 
    deleteTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:id')
    .delete(deleteTransaction);

module.exports = router;
