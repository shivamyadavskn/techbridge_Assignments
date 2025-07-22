const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const { transactionLimiter } = require('../middleware/rateLimiter');

router.use(authMiddleware);
router.use(transactionLimiter);

router.get('/', transactionController.getAllTransactions);
router.post('/', rbacMiddleware(['admin', 'user']), transactionController.createTransaction);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', rbacMiddleware(['admin', 'user']), transactionController.updateTransaction);
router.delete('/:id', rbacMiddleware(['admin', 'user']), transactionController.deleteTransaction);

module.exports = router; 