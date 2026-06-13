const express = require('express');
const router = express.Router();
const { getDevOpsStatus, getDeployments } = require('../controllers/devops.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/status', getDevOpsStatus);
router.get('/deployments', getDeployments);

module.exports = router;
