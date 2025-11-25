const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');

router.get('/', ensureAuthenticated, getDashboard);

module.exports = router;

