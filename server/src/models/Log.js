const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    level: { type: String, enum: ['INFO', 'WARN', 'ERROR', 'CRITICAL', 'DEBUG'], default: 'INFO' },
    source: { type: String, default: 'System' },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    missionName: { type: String, default: '' },
    component: { type: String, default: 'Core' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ source: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
