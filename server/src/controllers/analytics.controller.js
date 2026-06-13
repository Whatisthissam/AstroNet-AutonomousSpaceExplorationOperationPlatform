const Mission = require('../models/Mission');
const Incident = require('../models/Incident');
const Telemetry = require('../models/Telemetry');

// @desc    Get analytics overview (charts data)
// @route   GET /api/analytics/overview
exports.getAnalyticsOverview = async (req, res) => {
  try {
    // Fuel consumption over last 7 days (simulated)
    const fuelData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'ARES-VII': parseFloat((Math.random() * 3 + 1).toFixed(2)),
        'HERMES-IV': parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
        'EUROPA-II': parseFloat((Math.random() * 4 + 2).toFixed(2)),
      };
    });

    // Data transmission rates
    const transmissionData = Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i * 2).padStart(2, '0')}:00`,
      downlink: parseFloat((Math.random() * 80 + 40).toFixed(1)),
      uplink: parseFloat((Math.random() * 30 + 10).toFixed(1)),
    }));

    // Mission success rate by month
    const successRateData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => ({
      month,
      successRate: parseFloat((Math.random() * 20 + 78).toFixed(1)),
      missionCount: Math.floor(Math.random() * 5) + 3,
    }));

    // Resource utilization
    const resourceData = [
      { resource: 'Compute', used: parseFloat((Math.random() * 30 + 55).toFixed(1)), capacity: 100 },
      { resource: 'Memory', used: parseFloat((Math.random() * 20 + 60).toFixed(1)), capacity: 100 },
      { resource: 'Storage', used: parseFloat((Math.random() * 15 + 65).toFixed(1)), capacity: 100 },
      { resource: 'Bandwidth', used: parseFloat((Math.random() * 25 + 45).toFixed(1)), capacity: 100 },
      { resource: 'Power', used: parseFloat((Math.random() * 20 + 70).toFixed(1)), capacity: 100 },
    ];

    const totalMissions = await Mission.countDocuments();
    const completedMissions = await Mission.countDocuments({ status: 'completed' });
    const activeIncidents = await Incident.countDocuments({ status: { $in: ['active', 'investigating'] } });

    res.json({
      success: true,
      data: {
        fuelConsumption: fuelData,
        dataTransmission: transmissionData,
        successRate: successRateData,
        resourceUtilization: resourceData,
        kpis: {
          totalMissions,
          completedMissions,
          successRate: totalMissions > 0 ? parseFloat(((completedMissions / totalMissions) * 100).toFixed(1)) : 0,
          activeIncidents,
          avgResponseTime: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          dataProcessed: `${(Math.random() * 500 + 1200).toFixed(0)} TB`,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
