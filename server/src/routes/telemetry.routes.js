const express = require('express');
const router = express.Router();
const { getLatestTelemetry, getTelemetryHistory, getLiveTelemetry } = require('../controllers/telemetry.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/live', getLiveTelemetry);
router.get('/:missionId/latest', getLatestTelemetry);
router.get('/:missionId/history', getTelemetryHistory);

module.exports = router;
