const express = require('express');
const router = express.Router();
const { getLogs, createLog, getLogSummary } = require('../controllers/log.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/summary', getLogSummary);
router.get('/', getLogs);
router.post('/', createLog);

module.exports = router;
