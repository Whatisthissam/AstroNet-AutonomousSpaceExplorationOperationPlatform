const express = require('express');
const router = express.Router();
const { getAnalyticsOverview } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/overview', getAnalyticsOverview);

module.exports = router;
