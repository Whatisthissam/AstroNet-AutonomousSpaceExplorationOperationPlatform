const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    missionId: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ['planning', 'active', 'critical', 'completed', 'failed', 'standby'],
      default: 'planning',
    },
    phase: { type: String, default: 'Pre-Launch' },
    description: { type: String, default: '' },
    objective: { type: String, default: '' },
    launchDate: { type: Date },
    expectedEndDate: { type: Date },
    actualEndDate: { type: Date },
    healthScore: { type: Number, min: 0, max: 100, default: 100 },
    fuelLevel: { type: Number, min: 0, max: 100, default: 100 },
    communicationStatus: {
      type: String,
      enum: ['nominal', 'degraded', 'lost', 'standby'],
      default: 'nominal',
    },
    satelliteConnectivity: { type: Number, min: 0, max: 100, default: 100 },
    crew: [{ name: String, role: String, status: String }],
    destination: { type: String, default: 'Low Earth Orbit' },
    vehicleType: { type: String, default: 'Falcon-9' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    tags: [{ type: String }],
    commander: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    successProbability: { type: Number, min: 0, max: 100, default: 95 },
    distanceTraveled: { type: Number, default: 0 }, // km
    currentAltitude: { type: Number, default: 0 }, // km
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
