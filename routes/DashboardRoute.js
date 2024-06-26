const express = require('express')
const router = express.Router()
const GetDashboardController = require('../controllers/DashboardController')

router.get('/user', GetDashboardController.GetDashboard);

module.exports = router;