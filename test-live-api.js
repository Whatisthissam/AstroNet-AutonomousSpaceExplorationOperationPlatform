async function runTests() {
  const baseUrl = 'http://localhost:5080/api';

  console.log('Testing connection to live server health endpoint...');
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log('Health status:', healthData);

  // 1. Log in as admin to get an auth token
  console.log('\nLogging in as Admin to acquire auth token...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@astronet.io', password: 'Admin@123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error('Admin login failed: ' + loginData.message);
  }
  const token = loginData.token;
  console.log('✅ Admin authenticated. Token acquired.');

  // 2. Register a new user with elevated clearance level (clearanceLevel: 3)
  const testEmail = `test_operator_${Date.now()}@astronet.io`;
  console.log(`\nRegistering a new user via API: ${testEmail}...`);
  const registerRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Operator',
      email: testEmail,
      password: 'Testpassword123',
      role: 'controller',
      department: 'Navigation',
      clearanceLevel: 3
    })
  });
  const registerData = await registerRes.json();
  if (!registerData.success) {
    throw new Error('User registration failed: ' + registerData.message);
  }
  console.log('✅ User registered successfully!');
  console.log('Clearance Level registered:', registerData.user?.clearanceLevel);
  if (registerData.user?.clearanceLevel === 3) {
    console.log('✅ Verified: clearanceLevel is set to 3!');
  } else {
    console.error('❌ Error: clearanceLevel was not saved as 3. Actual:', registerData.user?.clearanceLevel);
  }

  // 3. Create a new mission using the admin token
  const testMissionId = `MSN-2026-TEST-${Date.now()}`;
  console.log(`\nCreating a new mission: TITAN EXPLORER (ID: ${testMissionId})...`);
  const missionRes = await fetch(`${baseUrl}/missions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'TITAN EXPLORER',
      missionId: testMissionId,
      status: 'planning',
      phase: 'Pre-Launch',
      destination: 'Titan Orbit',
      vehicleType: 'Falcon Heavy',
      priority: 'medium',
      commander: registerData.user?._id
    })
  });
  const missionData = await missionRes.json();
  if (!missionData.success) {
    throw new Error('Mission creation failed: ' + missionData.message);
  }
  console.log('✅ Mission created successfully!');
  console.log('Created Mission Details:', {
    name: missionData.data?.name,
    missionId: missionData.data?.missionId,
    commander: missionData.data?.commander
  });
}

runTests().catch(err => {
  console.error('❌ Verification failed:', err.message);
  process.exit(1);
});
