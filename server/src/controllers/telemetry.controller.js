const Telemetry = require('../models/Telemetry');
const Mission = require('../models/Mission');

// Simulate realistic telemetry variation
const simulateValue = (base, variance, min, max) => {
  const val = base + (Math.random() - 0.5) * variance;
  return Math.min(max, Math.max(min, parseFloat(val.toFixed(2))));
};

// @desc    Get latest telemetry for a mission
// @route   GET /api/telemetry/:missionId/latest
exports.getLatestTelemetry = async (req, res) => {
  try {
    const telemetry = await Telemetry.findOne({ missionId: req.params.missionId }).sort({ timestamp: -1 });
    if (!telemetry) return res.status(404).json({ success: false, message: 'No telemetry found' });
    res.json({ success: true, data: telemetry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get telemetry history for a mission
// @route   GET /api/telemetry/:missionId/history
exports.getTelemetryHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const telemetry = await Telemetry.find({ missionId: req.params.missionId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, data: telemetry.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get simulated live telemetry (no DB needed – pure simulation)
// @route   GET /api/telemetry/live
exports.getLiveTelemetry = async (req, res) => {
  try {
    const missions = await Mission.find({ status: 'active' }).select('_id missionId name fuelLevel currentAltitude');
    const live = missions.map((m) => ({
      missionId: m.missionId,
      missionName: m.name,
      temperature: simulateValue(-85, 40, -150, 120),
      altitude: simulateValue(m.currentAltitude || 408, 5, 200, 800),
      velocity: simulateValue(7660, 200, 7000, 8500),
      fuelLevel: simulateValue(m.fuelLevel || 75, 2, 0, 100),
      signalStrength: simulateValue(88, 8, 30, 100),
      batteryLevel: simulateValue(91, 5, 20, 100),
      pressure: simulateValue(1.1, 0.1, 0.5, 2.0),
      radiation: simulateValue(0.3, 0.05, 0, 2),
      solarPanelOutput: simulateValue(94, 3, 50, 100),
      dataTransmissionRate: simulateValue(125, 20, 10, 200),
      thrusterStatus: Math.random() > 0.95 ? 'degraded' : 'nominal',
      gyroscopeStatus: 'nominal',
      timestamp: new Date(),
    }));

    res.json({ success: true, data: live, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
