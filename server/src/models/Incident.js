const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  action: { type: String, required: true },
  actor: { type: String, default: 'System' },
  details: { type: String, default: '' },
});

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    status: { type: String, enum: ['active', 'investigating', 'resolved', 'closed'], default: 'active' },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    missionName: { type: String, default: 'N/A' },
    affectedSystem: { type: String, default: 'Unknown' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedToName: { type: String, default: 'Unassigned' },
    recoveryActions: [{ type: String }],
    timeline: [timelineEventSchema],
    resolvedAt: { type: Date },
    category: {
      type: String,
      enum: ['communication', 'power', 'navigation', 'structural', 'software', 'hardware', 'environmental'],
      default: 'software',
    },
    impactScore: { type: Number, min: 0, max: 10, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);
