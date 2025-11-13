// metrics.js
const client = require('prom-client');

// Enable collection of default metrics (CPU, memory, event loop lag)
client.collectDefaultMetrics();

// Custom metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Optional: Add latency histogram if you want deeper performance insight
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

function observeRequestMetrics(req, res, next) {
  const startEpoch = Date.now();

  res.on('finish', () => {
    const durationInSeconds = (Date.now() - startEpoch) / 1000;

    httpRequestCounter
      .labels(req.method, req.originalUrl.split('?')[0] || req.path, res.statusCode.toString())
      .inc();

    httpRequestDuration
      .labels(req.method, req.originalUrl.split('?')[0] || req.path, res.statusCode.toString())
      .observe(durationInSeconds);
  });

  next();
}

// Expose metrics endpoint handler
async function metricsEndpoint(req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}

module.exports = {
  observeRequestMetrics,
  metricsEndpoint,
};
