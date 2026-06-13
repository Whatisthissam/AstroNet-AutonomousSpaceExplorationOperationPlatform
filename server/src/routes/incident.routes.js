const express = require('express');
const router = express.Router();
const { getIncidents, getIncident, createIncident, updateIncident, addTimelineEvent, deleteIncident } = require('../controllers/incident.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getIncidents);
router.get('/:id', getIncident);
router.post('/', createIncident);
router.put('/:id', updateIncident);
router.post('/:id/timeline', addTimelineEvent);
router.delete('/:id', authorize('admin'), deleteIncident);

module.exports = router;
