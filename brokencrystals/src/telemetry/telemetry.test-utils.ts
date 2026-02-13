import {
  InMemorySpanExporter,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base';
import {
  BasicTracerProvider,
  ReadableSpan
} from '@opentelemetry/sdk-trace-base';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { InMemoryMetricExporter } from '@opentelemetry/sdk-metrics';
import { trace, metrics, context, Span } from '@opentelemetry/api';

/**
 * Test utilities for OpenTelemetry instrumentation testing
 * Provides in-memory exporters and utilities to validate telemetry data
 */

export class TelemetryTestUtils {
  private spanExporter: InMemorySpanExporter;
  private metricExporter: InMemoryMetricExporter;
  private tracerProvider: BasicTracerProvider;
  private meterProvider: MeterProvider;

  constructor() {
    // Setup in-memory span exporter
    this.spanExporter = new InMemorySpanExporter();
    this.tracerProvider = new BasicTracerProvider();
    this.tracerProvider.addSpanProcessor(
      new SimpleSpanProcessor(this.spanExporter)
    );
    this.tracerProvider.register();

    // Setup in-memory metric exporter
    this.metricExporter = new InMemoryMetricExporter();
    this.meterProvider = new MeterProvider({
      readers: [
        new PeriodicExportingMetricReader({
          exporter: this.metricExporter,
          exportIntervalMillis: 100 // Fast export for tests
        })
      ]
    });
    metrics.setGlobalMeterProvider(this.meterProvider);
  }

  /**
   * Get all exported spans
   */
  getSpans(): ReadableSpan[] {
    return this.spanExporter.getFinishedSpans();
  }

  /**
   * Get spans by name
   */
  getSpansByName(name: string): ReadableSpan[] {
    return this.getSpans().filter((span) => span.name === name);
  }

  /**
   * Get the most recent span
   */
  getLatestSpan(): ReadableSpan | undefined {
    const spans = this.getSpans();
    return spans[spans.length - 1];
  }

  /**
   * Find a span by attribute value
   */
  findSpanByAttribute(
    key: string,
    value: string | number | boolean
  ): ReadableSpan | undefined {
    return this.getSpans().find(
      (span) => span.attributes[key] === value
    );
  }

  /**
   * Check if a span has a specific attribute
   */
  spanHasAttribute(span: ReadableSpan, key: string): boolean {
    return key in span.attributes;
  }

  /**
   * Check if a span has a specific event
   */
  spanHasEvent(span: ReadableSpan, eventName: string): boolean {
    return span.events.some((event) => event.name === eventName);
  }

  /**
   * Get span attribute value
   */
  getSpanAttribute(
    span: ReadableSpan,
    key: string
  ): string | number | boolean | undefined {
    return span.attributes[key];
  }

  /**
   * Check if a span has an error status
   */
  spanHasError(span: ReadableSpan): boolean {
    return span.status.code === 2; // ERROR code
  }

  /**
   * Get all metric data
   */
  async getMetrics(): Promise<any> {
    await this.meterProvider.forceFlush();
    return this.metricExporter.getMetrics();
  }

  /**
   * Find a metric by name
   */
  async findMetricByName(name: string): Promise<any | undefined> {
    const metrics = await this.getMetrics();
    for (const resourceMetric of metrics) {
      for (const scopeMetric of resourceMetric.scopeMetrics) {
        const metric = scopeMetric.metrics.find((m: any) => m.descriptor.name === name);
        if (metric) {
          return metric;
        }
      }
    }
    return undefined;
  }

  /**
   * Clear all collected spans
   */
  clearSpans(): void {
    this.spanExporter.reset();
  }

  /**
   * Clear all collected metrics
   */
  clearMetrics(): void {
    this.metricExporter.reset();
  }

  /**
   * Clear all telemetry data
   */
  clearAll(): void {
    this.clearSpans();
    this.clearMetrics();
  }

  /**
   * Shutdown telemetry providers
   */
  async shutdown(): Promise<void> {
    await this.tracerProvider.shutdown();
    await this.meterProvider.shutdown();
  }

  /**
   * Assert that a span exists with the given name
   */
  assertSpanExists(name: string): void {
    const spans = this.getSpansByName(name);
    if (spans.length === 0) {
      throw new Error(`Expected span with name "${name}" to exist, but none found`);
    }
  }

  /**
   * Assert that a span has a specific attribute
   */
  assertSpanHasAttribute(
    span: ReadableSpan,
    key: string,
    expectedValue?: string | number | boolean
  ): void {
    if (!this.spanHasAttribute(span, key)) {
      throw new Error(`Expected span to have attribute "${key}"`);
    }
    if (expectedValue !== undefined && span.attributes[key] !== expectedValue) {
      throw new Error(
        `Expected span attribute "${key}" to be "${expectedValue}", but got "${span.attributes[key]}"`
      );
    }
  }

  /**
   * Assert that a span has an event
   */
  assertSpanHasEvent(span: ReadableSpan, eventName: string): void {
    if (!this.spanHasEvent(span, eventName)) {
      throw new Error(`Expected span to have event "${eventName}"`);
    }
  }

  /**
   * Assert that a span has error status
   */
  assertSpanHasError(span: ReadableSpan): void {
    if (!this.spanHasError(span)) {
      throw new Error('Expected span to have error status');
    }
  }

  /**
   * Assert that a metric exists
   */
  async assertMetricExists(name: string): Promise<void> {
    const metric = await this.findMetricByName(name);
    if (!metric) {
      throw new Error(`Expected metric with name "${name}" to exist, but none found`);
    }
  }

  /**
   * Wait for spans to be exported (useful for async operations)
   */
  async waitForSpans(minCount: number = 1, timeoutMs: number = 5000): Promise<void> {
    const startTime = Date.now();
    while (this.getSpans().length < minCount) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(
          `Timeout waiting for ${minCount} spans. Only ${this.getSpans().length} found.`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  /**
   * Print all spans for debugging
   */
  printSpans(): void {
    const spans = this.getSpans();
    console.log(`\n=== ${spans.length} Spans ===`);
    spans.forEach((span, index) => {
      console.log(`\nSpan ${index + 1}:`);
      console.log(`  Name: ${span.name}`);
      console.log(`  Status: ${span.status.code === 0 ? 'UNSET' : span.status.code === 1 ? 'OK' : 'ERROR'}`);
      console.log(`  Attributes:`, span.attributes);
      if (span.events.length > 0) {
        console.log(`  Events:`, span.events.map(e => e.name));
      }
    });
    console.log('\n');
  }

  /**
   * Print all metrics for debugging
   */
  async printMetrics(): Promise<void> {
    const metrics = await this.getMetrics();
    console.log(`\n=== Metrics ===`);
    for (const resourceMetric of metrics) {
      for (const scopeMetric of resourceMetric.scopeMetrics) {
        for (const metric of scopeMetric.metrics) {
          console.log(`\nMetric: ${metric.descriptor.name}`);
          console.log(`  Type: ${metric.descriptor.type}`);
          console.log(`  Unit: ${metric.descriptor.unit}`);
          console.log(`  Data Points:`, metric.dataPoints.length);
        }
      }
    }
    console.log('\n');
  }
}

/**
 * Create a test instance of TelemetryTestUtils
 */
export function createTelemetryTestUtils(): TelemetryTestUtils {
  return new TelemetryTestUtils();
}
