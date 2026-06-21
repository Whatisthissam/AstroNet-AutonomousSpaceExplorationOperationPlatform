const mongoose = require('mongoose');
const User = require('../src/models/User');
const Mission = require('../src/models/Mission');

const MONGO_URI = 'mongodb://localhost:27017/astronet';

async function runTests() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Test User Creation
  const testEmail = `test_operator_${Date.now()}@astronet.io`;
  const user = await User.create({
    name: 'Test Operator',
    email: testEmail,
    password: 'Testpassword123',
    role: 'controller',
    department: 'Navigation',
    clearanceLevel: 3
  });
  console.log('✅ Created User:', user.name, user.email, 'Role:', user.role, 'Clearance:', user.clearanceLevel);

  // Verify DB record
  const savedUser = await User.findOne({ email: testEmail });
  if (savedUser && savedUser.clearanceLevel === 3) {
    console.log('✅ Verified Clearance Level is 3 in DB!');
  } else {
    console.error('❌ Clearance Level mismatch in DB:', savedUser?.clearanceLevel);
  }

  // Test Mission Creation
  const testMissionId = `MSN-2026-TEST-${Date.now()}`;
  const mission = await Mission.create({
    name: 'TITAN EXPLORER',
    missionId: testMissionId,
    status: 'planning',
    phase: 'Pre-Launch',
    destination: 'Titan Orbit',
    vehicleType: 'Falcon Heavy',
    priority: 'medium',
    commander: savedUser._id
  });
  console.log('✅ Created Mission:', mission.name, 'ID:', mission.missionId);

  // Verify Mission
  const savedMission = await Mission.findOne({ missionId: testMissionId });
  if (savedMission && savedMission.name === 'TITAN EXPLORER') {
    console.log('✅ Verified Mission in DB!');
  } else {
    console.error('❌ Mission not found or mismatched in DB');
  }

  // Cleanup
  await User.deleteOne({ _id: savedUser._id });
  await Mission.deleteOne({ _id: savedMission._id });
  console.log('🧹 Cleaned up test records');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

runTests().catch(err => {
  console.error('Tests failed:', err);
  process.exit(1);
});
