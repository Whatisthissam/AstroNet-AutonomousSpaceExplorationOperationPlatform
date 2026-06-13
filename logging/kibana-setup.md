# Kibana Setup & Log Auditing Guide

This document explains how to set up, search, and visualize logs from the **AstroNet Platform** using Kibana.

---

## 🔌 Port Configuration

- **Elasticsearch API**: `http://localhost:9200`
- **Kibana Web UI**: `http://localhost:5601`

---

## ⚙️ Initial Configuration Steps

Once your Docker containers are running, access Kibana in your browser at `http://localhost:5601` and follow these configuration steps:

### 1. Create an Index Pattern
Kibana requires an index pattern to know which Elasticsearch indices contain your application logs:
1. Navigate to **Stack Management** > **Data Views** (formerly Index Patterns).
2. Click **Create data view**.
3. Set the **Name / Index pattern** to: `astronet-logs-*`.
4. Set the **Timestamp field** to `@timestamp`.
5. Click **Save data view to Kibana**.

### 2. Discover Logs
1. Click the side menu and select **Discover**.
2. Select the `astronet-logs-*` data view.
3. You should see a timeline graph and a list of log entries emitted by the AstroNet Express server and Nginx containers.

---

## 🔍 Log Searching & Filtering

Use Kibana Query Language (KQL) inside the search bar to filter your telemetry logs:

### Common Search Queries

- **Show only error logs**:
  ```kql
  level: "error"
  ```
- **Filter by a specific mission name**:
  ```kql
  message: "Apollo" or message: "Artemis"
  ```
- **Filter HTTP logs**:
  ```kql
  method: "POST" and status: 500
  ```
- **Show all database-related operations**:
  ```kql
  message: "MongoDB" or message: "connected"
  ```

---

## 📊 Dashboard Visualizations

To build a **DevOps Operations Logging Dashboard**, navigate to **Dashboard** > **Create dashboard** and add the following visualization panels:

### Panel 1: Log Level Distribution (Pie Chart)
- **Objective**: Monitor the proportion of `info`, `warn`, and `error` events.
- **Configuration**:
  - Chart Type: **Pie**
  - Slice by: `level.keyword`
  - Metric: **Count**

### Panel 2: Telemetry Log Volume over Time (Area Chart)
- **Objective**: Identify spikes in activity or connection outages.
- **Configuration**:
  - Chart Type: **Area**
  - X-Axis: `@timestamp` (daily or hourly buckets)
  - Y-Axis: **Count**

### Panel 3: Slowest API Route Hits (Bar Chart)
- **Objective**: Track API performance bottlenecks.
- **Configuration**:
  - Chart Type: **Horizontal Bar**
  - Breakdown by: `route.keyword` or `message.keyword`
  - Metric: **Average** of `latency_ms` or `duration` (if logged)

---

## 🔒 Production Hardening (ELK)
When deploying this stack in a production environment:
1. **Enable Authentication**: Set `xpack.security.enabled: true` in `elasticsearch.yml`.
2. **Encrypted Communication**: Generate SSL certificates (`CA.pem`) and force HTTPS between Logstash, Elasticsearch, and Kibana.
3. **Data Retention**: Configure **Index Lifecycle Management (ILM)** policies to automatically delete or snapshot logs older than 30 days to save disk space.
