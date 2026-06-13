// @desc    Get DevOps services status (simulated realistic data)
// @route   GET /api/devops/status
exports.getDevOpsStatus = async (req, res) => {
  try {
    const randomStatus = (weights = [0.85, 0.1, 0.05]) => {
      const r = Math.random();
      if (r < weights[0]) return 'operational';
      if (r < weights[0] + weights[1]) return 'degraded';
      return 'down';
    };

    const randomPercent = (base, variance) =>
      Math.min(100, Math.max(0, parseFloat((base + (Math.random() - 0.5) * variance).toFixed(1))));

    const services = {
      docker: {
        status: randomStatus(),
        containers: { running: Math.floor(Math.random() * 10) + 20, stopped: Math.floor(Math.random() * 5), total: 32 },
        version: '24.0.7',
        cpuUsage: randomPercent(35, 20),
        memoryUsage: randomPercent(62, 15),
      },
      jenkins: {
        status: randomStatus(),
        pipelines: { running: Math.floor(Math.random() * 3) + 1, queued: Math.floor(Math.random() * 5), failed: Math.floor(Math.random() * 2) },
        lastBuild: { number: Math.floor(Math.random() * 100) + 1200, result: Math.random() > 0.15 ? 'SUCCESS' : 'FAILURE', duration: `${Math.floor(Math.random() * 8) + 2}m ${Math.floor(Math.random() * 59)}s` },
        version: '2.426.3',
      },
      kubernetes: {
        status: randomStatus([0.9, 0.07, 0.03]),
        nodes: { ready: 5, notReady: Math.random() > 0.9 ? 1 : 0, total: 5 },
        pods: { running: Math.floor(Math.random() * 20) + 80, pending: Math.floor(Math.random() * 5), failed: Math.floor(Math.random() * 2), total: 108 },
        namespaces: 12,
        version: 'v1.29.0',
      },
      terraform: {
        status: randomStatus([0.88, 0.09, 0.03]),
        lastApply: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        resources: { managed: 847, tainted: Math.floor(Math.random() * 5), destroyed: 0 },
        workspaces: ['production', 'staging', 'development'],
        version: '1.6.6',
      },
      prometheus: {
        status: randomStatus([0.92, 0.06, 0.02]),
        targets: { up: Math.floor(Math.random() * 5) + 45, down: Math.floor(Math.random() * 3) },
        alertsFiring: Math.floor(Math.random() * 5),
        dataRetention: '15d',
        scrapeInterval: '15s',
        version: '2.48.0',
      },
      grafana: {
        status: randomStatus([0.93, 0.05, 0.02]),
        dashboards: 34,
        alerts: { firing: Math.floor(Math.random() * 4), silenced: Math.floor(Math.random() * 3) },
        users: 28,
        version: '10.2.3',
      },
      elk: {
        status: randomStatus([0.87, 0.10, 0.03]),
        elasticsearch: { nodes: 3, indicesCount: 47, storageUsed: `${randomPercent(680, 50)} GB` },
        logstash: { pipelinesActive: 8, eventsPerSecond: Math.floor(Math.random() * 5000) + 3000 },
        kibana: { status: randomStatus([0.92, 0.06, 0.02]) },
        version: '8.11.3',
      },
      vault: {
        status: randomStatus([0.95, 0.04, 0.01]),
        secrets: { engines: 12, leases: Math.floor(Math.random() * 200) + 800 },
        policies: 24,
        tokens: { total: Math.floor(Math.random() * 50) + 120 },
        sealed: false,
        version: '1.15.4',
      },
    };

    res.json({ success: true, data: services, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get deployment overview
// @route   GET /api/devops/deployments
exports.getDeployments = async (req, res) => {
  try {
    const deployments = [
      { id: 1, service: 'mission-api', environment: 'production', version: 'v2.4.1', status: 'success', deployedAt: new Date(Date.now() - 3600000 * 2), deployedBy: 'CI/CD Pipeline' },
      { id: 2, service: 'telemetry-processor', environment: 'production', version: 'v1.9.0', status: 'success', deployedAt: new Date(Date.now() - 3600000 * 8), deployedBy: 'Cmdr. Rodriguez' },
      { id: 3, service: 'dashboard-frontend', environment: 'staging', version: 'v3.1.0-beta', status: 'running', deployedAt: new Date(Date.now() - 3600000 * 1), deployedBy: 'CI/CD Pipeline' },
      { id: 4, service: 'incident-manager', environment: 'production', version: 'v1.2.3', status: 'failed', deployedAt: new Date(Date.now() - 3600000 * 0.5), deployedBy: 'Dr. Chen' },
      { id: 5, service: 'auth-service', environment: 'production', version: 'v4.0.2', status: 'success', deployedAt: new Date(Date.now() - 86400000), deployedBy: 'CI/CD Pipeline' },
    ];
    res.json({ success: true, data: deployments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
