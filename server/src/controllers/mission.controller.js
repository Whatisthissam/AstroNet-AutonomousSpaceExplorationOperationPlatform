const Mission = require('../models/Mission');
const Log = require('../models/Log');
const logger = require('../utils/logger');

// @desc    Get all missions
// @route   GET /api/missions
exports.getMissions = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const missions = await Mission.find(filter)
      .populate('commander', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Mission.countDocuments(filter);
    res.json({ success: true, data: missions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get mission by ID
// @route   GET /api/missions/:id
exports.getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('commander', 'name email');
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create mission
// @route   POST /api/missions
exports.createMission = async (req, res) => {
  try {
    const mission = await Mission.create(req.body);
    await Log.create({ message: `Mission created: ${mission.name}`, level: 'INFO', source: 'Mission Control', component: 'Missions' });
    logger.info(`Mission created: ${mission.name}`);
    res.status(201).json({ success: true, data: mission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update mission
// @route   PUT /api/missions/:id
exports.updateMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    await Log.create({ message: `Mission updated: ${mission.name}`, level: 'INFO', source: 'Mission Control', component: 'Missions' });
    res.json({ success: true, data: mission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete mission
// @route   DELETE /api/missions/:id
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' });
    res.json({ success: true, message: 'Mission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get mission stats
// @route   GET /api/missions/stats
exports.getMissionStats = async (req, res) => {
  try {
    const stats = await Mission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgHealth: { $avg: '$healthScore' },
          avgFuel: { $avg: '$fuelLevel' },
        },
      },
    ]);

    const total = await Mission.countDocuments();
    const active = await Mission.countDocuments({ status: 'active' });
    const critical = await Mission.countDocuments({ status: 'critical' });
    const completed = await Mission.countDocuments({ status: 'completed' });
    const avgHealth = await Mission.aggregate([{ $group: { _id: null, avg: { $avg: '$healthScore' } } }]);

    res.json({
      success: true,
      data: { total, active, critical, completed, avgHealth: avgHealth[0]?.avg || 0, breakdown: stats },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
