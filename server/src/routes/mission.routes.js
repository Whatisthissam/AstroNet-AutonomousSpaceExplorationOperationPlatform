const express = require('express');
const router = express.Router();
const { getMissions, getMission, createMission, updateMission, deleteMission, getMissionStats } = require('../controllers/mission.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/stats', getMissionStats);
router.get('/', getMissions);
router.get('/:id', getMission);
router.post('/', authorize('admin', 'controller'), createMission);
router.put('/:id', authorize('admin', 'controller'), updateMission);
router.delete('/:id', authorize('admin'), deleteMission);

module.exports = router;
