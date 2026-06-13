const Log = require('../models/Log');

// @desc    Get logs with search and filter
// @route   GET /api/logs
exports.getLogs = async (req, res) => {
  try {
    const { level, source, search, page = 1, limit = 50, startDate, endDate } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (source) filter.source = source;
    if (search) filter.$or = [{ message: { $regex: search, $options: 'i' } }, { source: { $regex: search, $options: 'i' } }];
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(filter);
    res.json({ success: true, data: logs, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create log
// @route   POST /api/logs
exports.createLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get log summary (counts by level)
// @route   GET /api/logs/summary
exports.getLogSummary = async (req, res) => {
  try {
    const summary = await Log.aggregate([{ $group: { _id: '$level', count: { $sum: 1 } } }]);
    const total = await Log.countDocuments();
    res.json({ success: true, data: { summary, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
