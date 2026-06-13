const Incident = require('../models/Incident');
const Log = require('../models/Log');

// @desc    Get all incidents
// @route   GET /api/incidents
exports.getIncidents = async (req, res) => {
  try {
    const { status, severity, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Incident.countDocuments(filter);
    res.json({ success: true, data: incidents, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get incident by ID
// @route   GET /api/incidents/:id
exports.getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
    res.json({ success: true, data: incident });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create incident
// @route   POST /api/incidents
exports.createIncident = async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      timeline: [{ action: 'Incident reported', actor: req.user?.name || 'System', details: req.body.description }],
    });
    await Log.create({ message: `Incident created: ${incident.title}`, level: incident.severity === 'critical' ? 'CRITICAL' : 'WARN', source: 'Incident Management', component: 'Incidents' });
    res.status(201).json({ success: true, data: incident });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
exports.updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

    Object.assign(incident, req.body);
    if (req.body.status === 'resolved' && !incident.resolvedAt) {
      incident.resolvedAt = new Date();
      incident.timeline.push({ action: 'Incident resolved', actor: req.user?.name || 'System' });
    }
    await incident.save();
    res.json({ success: true, data: incident });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add timeline event
// @route   POST /api/incidents/:id/timeline
exports.addTimelineEvent = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
    incident.timeline.push({ ...req.body, actor: req.user?.name || 'System', time: new Date() });
    await incident.save();
    res.json({ success: true, data: incident });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
exports.deleteIncident = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
