require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Mission = require('../src/models/Mission');
const Incident = require('../src/models/Incident');
const Log = require('../src/models/Log');
const Telemetry = require('../src/models/Telemetry');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/astronet';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clean existing data
  await Promise.all([User.deleteMany(), Mission.deleteMany(), Incident.deleteMany(), Log.deleteMany(), Telemetry.deleteMany()]);
  console.log('🧹 Cleared existing data');

  // Seed Users
  const users = await User.create([
    { name: 'Commander Sarah Mitchell', email: 'admin@astronet.io', password: 'Admin@123', role: 'admin', department: 'Command Center', clearanceLevel: 5 },
    { name: 'Dr. James Rodriguez', email: 'controller@astronet.io', password: 'Control@123', role: 'controller', department: 'Mission Control', clearanceLevel: 4 },
    { name: 'Dr. Aisha Chen', email: 'analyst@astronet.io', password: 'Analyst@123', role: 'analyst', department: 'Telemetry Analysis', clearanceLevel: 3 },
    { name: 'Capt. Leo Nakamura', email: 'leo@astronet.io', password: 'Leo@12345', role: 'controller', department: 'Navigation', clearanceLevel: 3 },
  ]);
  console.log(`👥 Created ${users.length} users`);

  // Seed Missions
  const missions = await Mission.create([
    {
      name: 'ARES-VII Mars Survey',
      missionId: 'MSN-2024-001',
      status: 'active',
      phase: 'Orbital Insertion',
      description: 'Advanced robotic survey mission to Mars surface and atmosphere.',
      objective: 'Map geological formations and detect sub-surface water deposits.',
      launchDate: new Date('2024-03-15'),
      expectedEndDate: new Date('2026-03-15'),
      healthScore: 94,
      fuelLevel: 72,
      communicationStatus: 'nominal',
      satelliteConnectivity: 98,
      destination: 'Mars Orbit',
      vehicleType: 'Atlas V',
      priority: 'critical',
      commander: users[0]._id,
      successProbability: 91,
      currentAltitude: 258,
      distanceTraveled: 225000000,
      crew: [{ name: 'ARES-AI', role: 'Autonomous Navigation', status: 'operational' }],
      tags: ['Mars', 'Survey', 'Robotic'],
    },
    {
      name: 'HERMES-IV Lunar Gateway',
      missionId: 'MSN-2024-002',
      status: 'active',
      phase: 'Trans-Lunar Injection',
      description: 'Crewed mission to establish the Lunar Gateway outpost.',
      objective: 'Assemble the first modules of the Lunar Gateway space station.',
      launchDate: new Date('2024-06-01'),
      expectedEndDate: new Date('2024-12-01'),
      healthScore: 88,
      fuelLevel: 61,
      communicationStatus: 'nominal',
      satelliteConnectivity: 95,
      destination: 'Lunar Orbit',
      vehicleType: 'SLS Block 1',
      priority: 'high',
      commander: users[1]._id,
      successProbability: 96,
      currentAltitude: 408,
      distanceTraveled: 380000,
      crew: [
        { name: 'Dr. Elena Vasquez', role: 'Commander', status: 'active' },
        { name: 'Maj. Thomas Park', role: 'Pilot', status: 'active' },
        { name: 'Dr. Priya Sharma', role: 'Mission Specialist', status: 'active' },
      ],
      tags: ['Lunar', 'Crewed', 'Gateway'],
    },
    {
      name: 'EUROPA-II Ocean Probe',
      missionId: 'MSN-2024-003',
      status: 'critical',
      phase: 'Jupiter Approach',
      description: 'Probe designed to penetrate Europa\'s ice sheet and explore subsurface ocean.',
      objective: 'Detect biosignatures and analyze ocean chemistry of Europa.',
      launchDate: new Date('2023-11-10'),
      expectedEndDate: new Date('2027-06-10'),
      healthScore: 61,
      fuelLevel: 48,
      communicationStatus: 'degraded',
      satelliteConnectivity: 67,
      destination: 'Europa (Jupiter Moon)',
      vehicleType: 'Falcon Heavy',
      priority: 'critical',
      commander: users[0]._id,
      successProbability: 74,
      currentAltitude: 550,
      distanceTraveled: 628000000,
      crew: [{ name: 'EUROPA-AI', role: 'Autonomous Science', status: 'degraded' }],
      tags: ['Europa', 'Jupiter', 'Ocean', 'Astrobiology'],
    },
    {
      name: 'SOLAR WATCH-I',
      missionId: 'MSN-2024-004',
      status: 'standby',
      phase: 'Pre-Launch',
      description: 'Solar observatory positioned at L1 Lagrange point.',
      objective: 'Monitor solar wind, CMEs, and space weather prediction.',
      launchDate: new Date('2024-09-20'),
      healthScore: 100,
      fuelLevel: 100,
      communicationStatus: 'standby',
      satelliteConnectivity: 100,
      destination: 'L1 Lagrange Point',
      vehicleType: 'Ariane 6',
      priority: 'high',
      commander: users[3]._id,
      successProbability: 98,
      currentAltitude: 0,
      distanceTraveled: 0,
      tags: ['Solar', 'Observatory', 'L1'],
    },
    {
      name: 'TITAN DRIFT-III',
      missionId: 'MSN-2023-009',
      status: 'completed',
      phase: 'Mission Complete',
      description: 'Atmospheric probe exploring Titan\'s hydrocarbon lakes.',
      objective: 'Analyze chemical composition of Titan\'s methane seas.',
      launchDate: new Date('2021-05-12'),
      expectedEndDate: new Date('2023-11-30'),
      actualEndDate: new Date('2023-11-28'),
      healthScore: 100,
      fuelLevel: 0,
      communicationStatus: 'nominal',
      satelliteConnectivity: 100,
      destination: 'Titan (Saturn Moon)',
      vehicleType: 'Atlas V 541',
      priority: 'medium',
      successProbability: 100,
      distanceTraveled: 1200000000,
      tags: ['Titan', 'Saturn', 'Atmosphere'],
    },
  ]);
  console.log(`🚀 Created ${missions.length} missions`);

  // Seed Incidents
  await Incident.create([
    {
      title: 'EUROPA-II Communication Degradation',
      description: 'Primary antenna suffering pointing error, causing signal degradation.',
      severity: 'critical',
      status: 'investigating',
      mission: missions[2]._id,
      missionName: 'EUROPA-II Ocean Probe',
      affectedSystem: 'Communication Array',
      assignedToName: 'Dr. James Rodriguez',
      recoveryActions: ['Activate backup antenna', 'Recompute pointing vector', 'Schedule maintenance window'],
      category: 'communication',
      impactScore: 9,
      timeline: [
        { action: 'Anomaly detected', actor: 'EUROPA-AI', details: 'Signal drop of 33% detected', time: new Date(Date.now() - 7200000) },
        { action: 'Incident escalated to critical', actor: 'System Monitor', time: new Date(Date.now() - 6800000) },
        { action: 'Team assigned', actor: 'Dr. James Rodriguez', details: 'Investigating antenna pointing algorithm', time: new Date(Date.now() - 5400000) },
      ],
    },
    {
      title: 'ARES-VII Thermal Sensor Spike',
      description: 'Sensor T-7 reported abnormal temperature readings during solar exposure window.',
      severity: 'medium',
      status: 'active',
      mission: missions[0]._id,
      missionName: 'ARES-VII Mars Survey',
      affectedSystem: 'Thermal Management',
      assignedToName: 'Dr. Aisha Chen',
      recoveryActions: ['Cross-reference with redundant sensors', 'Adjust thermal shielding orientation'],
      category: 'hardware',
      impactScore: 5,
      timeline: [
        { action: 'Sensor alert triggered', actor: 'ARES-VII Autonomy', time: new Date(Date.now() - 3600000) },
        { action: 'Initial assessment complete', actor: 'Dr. Aisha Chen', details: 'Likely calibration drift, non-critical', time: new Date(Date.now() - 1800000) },
      ],
    },
    {
      title: 'Ground Station DS-47 Power Interruption',
      description: 'Deep Space Station 47 experienced 12-minute power interruption affecting contact window.',
      severity: 'high',
      status: 'resolved',
      missionName: 'All Active Missions',
      affectedSystem: 'Ground Infrastructure',
      assignedToName: 'Capt. Leo Nakamura',
      recoveryActions: ['Switch to backup generators', 'Re-establish contact with ARES-VII', 'File incident report'],
      category: 'power',
      impactScore: 7,
      resolvedAt: new Date(Date.now() - 1800000),
      timeline: [
        { action: 'Power failure detected', actor: 'Facility Monitor', time: new Date(Date.now() - 5400000) },
        { action: 'Backup generators activated', actor: 'Ground Operations', time: new Date(Date.now() - 5200000) },
        { action: 'Full power restored', actor: 'Facility Engineer', time: new Date(Date.now() - 4200000) },
        { action: 'Incident resolved', actor: 'Capt. Leo Nakamura', time: new Date(Date.now() - 1800000) },
      ],
    },
  ]);
  console.log('⚠️  Created incidents');

  // Seed Logs
  const logMessages = [
    { message: 'System startup complete - All services nominal', level: 'INFO', source: 'System', component: 'Core' },
    { message: 'ARES-VII telemetry packet received - 2048 bytes', level: 'INFO', source: 'Telemetry', component: 'Receiver' },
    { message: 'EUROPA-II signal strength dropped below threshold (67%)', level: 'WARN', source: 'Communication', component: 'Signal Monitor' },
    { message: 'Authentication attempt from unknown IP: 192.168.1.105', level: 'WARN', source: 'Security', component: 'Auth Guard' },
    { message: 'HERMES-IV course correction burn completed successfully', level: 'INFO', source: 'Navigation', component: 'Propulsion' },
    { message: 'Database backup completed - 4.2GB archived', level: 'INFO', source: 'Database', component: 'Backup Service' },
    { message: 'EUROPA-II primary antenna pointing error detected', level: 'ERROR', source: 'Communication', component: 'Antenna Control' },
    { message: 'Incident INC-2024-001 escalated to CRITICAL severity', level: 'CRITICAL', source: 'Incident Management', component: 'Escalation Engine' },
    { message: 'Docker container mission-api restarted (OOMKilled)', level: 'ERROR', source: 'Infrastructure', component: 'Docker' },
    { message: 'Jenkins pipeline astronet-deploy #1287 completed: SUCCESS', level: 'INFO', source: 'CI/CD', component: 'Jenkins' },
    { message: 'Kubernetes node worker-3 memory usage at 89%', level: 'WARN', source: 'Infrastructure', component: 'Kubernetes' },
    { message: 'Vault token rotated for service: telemetry-processor', level: 'INFO', source: 'Security', component: 'Vault' },
    { message: 'Prometheus alert: High CPU on mission-api pod', level: 'WARN', source: 'Monitoring', component: 'Prometheus' },
    { message: 'Solar flare activity detected - communication windows adjusted', level: 'WARN', source: 'Space Weather', component: 'Solar Monitor' },
    { message: 'ARES-VII science data package received - 847MB processed', level: 'INFO', source: 'Data Processing', component: 'Science Pipeline' },
  ];

  const logsToInsert = logMessages.map((log, i) => ({
    ...log,
    timestamp: new Date(Date.now() - i * 600000),
  }));
  await Log.insertMany(logsToInsert);
  console.log(`📋 Created ${logsToInsert.length} log entries`);

  // Seed Telemetry
  const activeMissions = missions.filter((m) => m.status === 'active' || m.status === 'critical');
  for (const mission of activeMissions) {
    const telemetryPoints = Array.from({ length: 20 }, (_, i) => ({
      mission: mission._id,
      missionId: mission.missionId,
      temperature: -85 + (Math.random() - 0.5) * 40,
      altitude: (mission.currentAltitude || 408) + (Math.random() - 0.5) * 5,
      velocity: 7660 + (Math.random() - 0.5) * 200,
      fuelLevel: mission.fuelLevel - i * 0.1 + (Math.random() - 0.5),
      signalStrength: mission.status === 'critical' ? 65 + Math.random() * 10 : 85 + Math.random() * 10,
      batteryLevel: 88 + (Math.random() - 0.5) * 5,
      timestamp: new Date(Date.now() - i * 300000),
    }));
    await Telemetry.insertMany(telemetryPoints);
  }
  console.log('📡 Created telemetry data');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📌 Login credentials:');
  console.log('   Admin:      admin@astronet.io    / Admin@123');
  console.log('   Controller: controller@astronet.io / Control@123');
  console.log('   Analyst:    analyst@astronet.io   / Analyst@123\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
