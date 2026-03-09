// OpenTelemetry initialization for BrokenCrystals application
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter
} = require('@opentelemetry/exporter-trace-otlp-grpc');
const {
  OTLPMetricExporter
} = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-grpc');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const {
  LoggerProvider,
  BatchLogRecordProcessor
} = require('@opentelemetry/sdk-logs');
const { Resource } = require('@opentelemetry/resources');
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT,
  ATTR_HOST_NAME,
  ATTR_PROCESS_PID,
  ATTR_PROCESS_RUNTIME_NAME,
  ATTR_PROCESS_RUNTIME_VERSION
} = require('@opentelemetry/semantic-conventions');
const {
  GraphQLInstrumentation
} = require('@opentelemetry/instrumentation-graphql');
const {
  ParentBasedSampler,
  TraceIdRatioBasedSampler
} = require('@opentelemetry/core');
const os = require('os');

// Load package.json for version info
const packageJson = require('./package.json');

// Configure sampling ratio (default to 100% for development, can be overridden via env)
const samplingRatio = parseFloat(process.env.OTEL_TRACES_SAMPLER_ARG || '1.0');

// Create enhanced resource with additional attributes
const resource = new Resource({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'brokencrystals',
  [ATTR_SERVICE_VERSION]: packageJson.version || '0.0.1',
  [ATTR_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  [ATTR_HOST_NAME]: os.hostname(),
  [ATTR_PROCESS_PID]: process.pid,
  [ATTR_PROCESS_RUNTIME_NAME]: 'nodejs',
  [ATTR_PROCESS_RUNTIME_VERSION]: process.version,
  // Add custom attributes
  'service.namespace': process.env.SERVICE_NAMESPACE || 'default',
  'service.instance.id': process.env.HOSTNAME || os.hostname()
});

// Configure log exporter (only if logs are enabled)
const logExporter =
  process.env.OTEL_LOGS_EXPORTER !== 'none'
    ? new OTLPLogExporter({
        url:
          process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
          'http://host.docker.internal:4317'
      })
    : null;

// Create logger provider if logs are enabled
let loggerProvider = null;
if (logExporter) {
  loggerProvider = new LoggerProvider({ resource });
  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(logExporter)
  );
}

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource,
  // Configure parent-based sampler with ratio-based sampling
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(samplingRatio)
  }),
  traceExporter: new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
      'http://host.docker.internal:4317'
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url:
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
        'http://host.docker.internal:4317'
    }),
    exportIntervalMillis: 60000 // Export metrics every 60 seconds
  }),
  loggerProvider,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable file system instrumentation (too noisy)
      '@opentelemetry/instrumentation-fs': {
        enabled: false
      },

      // Configure HTTP instrumentation
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        requestHook: (span, request) => {
          const headers = request.headers || {};
          for (const [name, value] of Object.entries(headers)) {
            const key = `http.request.header.${name.toLowerCase()}`;
            span.setAttribute(key, Array.isArray(value) ? value : [value]);
          }
        },
        applyCustomAttributesOnSpan: (span, request) => {
          // Add client IP if forwarded
          if (request.headers && request.headers['x-forwarded-for']) {
            span.setAttribute(
              'http.client_ip',
              request.headers['x-forwarded-for']
            );
          }
        },
        // Add response hook for error handling and response headers
        responseHook: (span, response) => {
          if (response.statusCode >= 400) {
            span.setStatus({
              code: response.statusCode >= 500 ? 2 : 1, // ERROR : OK with error flag
              message: `HTTP ${response.statusCode}`
            });
          }
          // Capture response headers
          const headers =
            typeof response.getHeaders === 'function'
              ? response.getHeaders()
              : response.headers || {};
          for (const [name, value] of Object.entries(headers)) {
            const key = `http.response.header.${name.toLowerCase()}`;
            span.setAttribute(key, Array.isArray(value) ? value : [String(value)]);
          }
        }
      },

      // Enable NestJS instrumentation
      '@opentelemetry/instrumentation-nestjs-core': {
        enabled: true
      },

      // Enable Fastify instrumentation
      '@opentelemetry/instrumentation-fastify': {
        enabled: true,
        requestHook: (span, info) => {
          // Update span name with method and URL
          if (info && info.request) {
            span.updateName(`${info.request.method} ${info.request.url}`);
          }
        }
      },

      // Enable PostgreSQL instrumentation
      '@opentelemetry/instrumentation-pg': {
        enabled: true,
        enhancedDatabaseReporting: true // Include query parameters (be careful with sensitive data)
      },

      // Enable gRPC instrumentation
      '@opentelemetry/instrumentation-grpc': {
        enabled: true
      },

      // Enable DNS instrumentation
      '@opentelemetry/instrumentation-dns': {
        enabled: true
      },

      // Enable net instrumentation
      '@opentelemetry/instrumentation-net': {
        enabled: true
      }
    }),
    // Add GraphQL instrumentation
    new GraphQLInstrumentation({
      // Merge resolve spans into single span for performance
      mergeItems: true,
      // Don't add source to spans (can be large)
      allowValues: false,
      // Capture depth of GraphQL query
      depth: -1, // -1 means unlimited
      // Add response hook for error handling
      responseHook: (span, data) => {
        if (data.errors && data.errors.length > 0) {
          span.setStatus({
            code: 2, // ERROR
            message: 'GraphQL errors occurred'
          });
          // Record errors as span events
          data.errors.forEach((error, index) => {
            span.addEvent(`graphql.error.${index}`, {
              'error.message': error.message,
              'error.path': error.path ? JSON.stringify(error.path) : undefined
            });
          });
        }
      }
    })
  ]
});

// Start the SDK
try {
  sdk.start();
  console.log('OpenTelemetry tracing initialized successfully');
  console.log(`Service: ${process.env.OTEL_SERVICE_NAME || 'brokencrystals'}`);
  console.log(
    `Endpoint: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://host.docker.internal:4317'}`
  );
  console.log(`Sampling ratio: ${samplingRatio * 100}%`);
  console.log(`Logs enabled: ${logExporter !== null}`);
} catch (error) {
  console.error('Error initializing OpenTelemetry SDK', error);
  process.exit(1);
}

// Graceful shutdown
const shutdown = () => {
  sdk
    .shutdown()
    .then(() => {
      if (loggerProvider) {
        return loggerProvider.shutdown();
      }
    })
    .then(() => console.log('OpenTelemetry SDK terminated'))
    .catch((error) =>
      console.error('Error terminating OpenTelemetry SDK', error)
    )
    .finally(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = sdk;
