import { Test, TestingModule } from '@nestjs/testing';
import { trace, context, propagation, ROOT_CONTEXT } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { createTelemetryTestUtils, TelemetryTestUtils } from './telemetry.test-utils';
import { TelemetryService } from './telemetry.service';

describe('Context Propagation', () => {
  let telemetryUtils: TelemetryTestUtils;
  let service: TelemetryService;

  beforeEach(async () => {
    telemetryUtils = createTelemetryTestUtils();

    // Set W3C Trace Context propagator
    propagation.setGlobalPropagator(new W3CTraceContextPropagator());

    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService]
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  afterEach(async () => {
    telemetryUtils.clearAll();
  });

  afterAll(async () => {
    await telemetryUtils.shutdown();
  });

  describe('Async operations', () => {
    it('should propagate context across async boundaries', async () => {
      await service.startActiveSpan('parent-span', async (parentSpan) => {
        const parentSpanContext = parentSpan.spanContext();

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Start child span - should have parent context
        await service.startActiveSpan('child-span', async (childSpan) => {
          const childSpanContext = childSpan.spanContext();

          // Child should have same trace ID as parent
          expect(childSpanContext.traceId).toBe(parentSpanContext.traceId);
        });
      });

      await telemetryUtils.waitForSpans(2);
      const spans = telemetryUtils.getSpans();

      expect(spans).toHaveLength(2);

      const parentSpan = telemetryUtils.getSpansByName('parent-span')[0];
      const childSpan = telemetryUtils.getSpansByName('child-span')[0];

      // Both spans should share the same trace ID
      expect(childSpan.spanContext().traceId).toBe(parentSpan.spanContext().traceId);

      // Child span should reference parent
      expect(childSpan.parentSpanId).toBe(parentSpan.spanContext().spanId);
    });

    it('should maintain context across Promise.all', async () => {
      await service.startActiveSpan('root-span', async () => {
        const promises = [
          service.startActiveSpan('concurrent-1', async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }),
          service.startActiveSpan('concurrent-2', async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }),
          service.startActiveSpan('concurrent-3', async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
          })
        ];

        await Promise.all(promises);
      });

      await telemetryUtils.waitForSpans(4);
      const spans = telemetryUtils.getSpans();

      expect(spans).toHaveLength(4);

      const rootSpan = telemetryUtils.getSpansByName('root-span')[0];
      const concurrent1 = telemetryUtils.getSpansByName('concurrent-1')[0];
      const concurrent2 = telemetryUtils.getSpansByName('concurrent-2')[0];
      const concurrent3 = telemetryUtils.getSpansByName('concurrent-3')[0];

      // All should share same trace ID
      expect(concurrent1.spanContext().traceId).toBe(rootSpan.spanContext().traceId);
      expect(concurrent2.spanContext().traceId).toBe(rootSpan.spanContext().traceId);
      expect(concurrent3.spanContext().traceId).toBe(rootSpan.spanContext().traceId);
    });
  });

  describe('HTTP header propagation', () => {
    it('should inject trace context into HTTP headers', () => {
      const headers: Record<string, string> = {};

      service.startActiveSpan('http-request', (span) => {
        const currentContext = trace.setSpan(context.active(), span);

        // Inject context into headers
        propagation.inject(currentContext, headers);

        // Should have traceparent header
        expect(headers['traceparent']).toBeDefined();

        // Traceparent format: version-traceId-spanId-flags
        const traceparent = headers['traceparent'];
        const parts = traceparent.split('-');

        expect(parts).toHaveLength(4);
        expect(parts[0]).toBe('00'); // version
        expect(parts[1]).toBe(span.spanContext().traceId);
        expect(parts[2]).toBe(span.spanContext().spanId);
      });
    });

    it('should extract trace context from HTTP headers', async () => {
      const incomingHeaders = {
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
      };

      const extractedContext = propagation.extract(ROOT_CONTEXT, incomingHeaders);
      const extractedSpanContext = trace.getSpanContext(extractedContext);

      expect(extractedSpanContext).toBeDefined();
      expect(extractedSpanContext?.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
      expect(extractedSpanContext?.spanId).toBe('00f067aa0ba902b7');
    });

    it('should create child span from extracted context', async () => {
      const incomingHeaders = {
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
      };

      const extractedContext = propagation.extract(ROOT_CONTEXT, incomingHeaders);

      // Run in extracted context
      await context.with(extractedContext, async () => {
        await service.startActiveSpan('child-from-remote', async (span) => {
          // This span should have the extracted trace ID
          expect(span.spanContext().traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
        });
      });

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('child-from-remote')[0];

      expect(span.spanContext().traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
    });
  });

  describe('Context isolation', () => {
    it('should isolate contexts between different traces', async () => {
      const trace1Promise = service.startActiveSpan('trace-1', async (span1) => {
        const traceId1 = span1.spanContext().traceId;

        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, 10));

        return traceId1;
      });

      const trace2Promise = service.startActiveSpan('trace-2', async (span2) => {
        const traceId2 = span2.spanContext().traceId;

        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, 10));

        return traceId2;
      });

      const [traceId1, traceId2] = await Promise.all([trace1Promise, trace2Promise]);

      // Different traces should have different trace IDs
      expect(traceId1).not.toBe(traceId2);

      await telemetryUtils.waitForSpans(2);
      const span1 = telemetryUtils.getSpansByName('trace-1')[0];
      const span2 = telemetryUtils.getSpansByName('trace-2')[0];

      expect(span1.spanContext().traceId).not.toBe(span2.spanContext().traceId);
    });
  });

  describe('Nested span hierarchy', () => {
    it('should maintain correct parent-child relationships', async () => {
      await service.startActiveSpan('level-1', async () => {
        await service.startActiveSpan('level-2', async () => {
          await service.startActiveSpan('level-3', async () => {
            // Deepest level
          });
        });
      });

      await telemetryUtils.waitForSpans(3);

      const level1 = telemetryUtils.getSpansByName('level-1')[0];
      const level2 = telemetryUtils.getSpansByName('level-2')[0];
      const level3 = telemetryUtils.getSpansByName('level-3')[0];

      // All should share same trace
      expect(level2.spanContext().traceId).toBe(level1.spanContext().traceId);
      expect(level3.spanContext().traceId).toBe(level1.spanContext().traceId);

      // Check parent relationships
      expect(level2.parentSpanId).toBe(level1.spanContext().spanId);
      expect(level3.parentSpanId).toBe(level2.spanContext().spanId);
    });
  });
});
