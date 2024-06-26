const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/FinanceController');


// Routes related to financial transactions
router.post('/deposit', FinanceController.Deposit);
router.post('/withdraw', FinanceController.Withdraw);

module.exports = router;
