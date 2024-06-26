const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const FinanceController = require('../controllers/FinanceController');

// Routes related to user authentication
router.post('/register', UserController.RegisterUser);
router.post('/login', UserController.LoginUser);
router.post('/logout', UserController.LogOutUser);
router.get('/profile', UserController.getUserProfile);
router.post('/update-profile', UserController.UpdateProfile)

// Routes related to financial transactions
router.post('/deposit', FinanceController.Deposit);
router.post('/withdraw', FinanceController.Withdraw);

module.exports = router;
