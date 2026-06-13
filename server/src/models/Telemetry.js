const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    missionId: { type: String, required: true },
    temperature: { type: Number, default: -120 }, // Celsius
    altitude: { type: Number, default: 400 }, // km
    velocity: { type: Number, default: 7900 }, // m/s
    fuelLevel: { type: Number, min: 0, max: 100, default: 85 }, // %
    signalStrength: { type: Number, min: 0, max: 100, default: 92 }, // %
    batteryLevel: { type: Number, min: 0, max: 100, default: 88 }, // %
    pressure: { type: Number, default: 1.2 }, // atm
    radiation: { type: Number, default: 0.3 }, // mSv/hr
    solarPanelOutput: { type: Number, default: 94 }, // %
    dataTransmissionRate: { type: Number, default: 125 }, // Mbps
    thrusterStatus: { type: String, enum: ['nominal', 'degraded', 'offline'], default: 'nominal' },
    gyroscopeStatus: { type: String, enum: ['nominal', 'degraded', 'offline'], default: 'nominal' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

telemetrySchema.index({ mission: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
