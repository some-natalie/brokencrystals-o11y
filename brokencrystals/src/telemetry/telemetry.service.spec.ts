import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { createTelemetryTestUtils, TelemetryTestUtils } from './telemetry.test-utils';
import { SpanStatusCode } from '@opentelemetry/api';

describe('TelemetryService', () => {
  let service: TelemetryService;
  let telemetryUtils: TelemetryTestUtils;

  beforeEach(async () => {
    // Create test utilities
    telemetryUtils = createTelemetryTestUtils();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService]
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  afterEach(async () => {
    // Clear telemetry data between tests
    telemetryUtils.clearAll();
  });

  afterAll(async () => {
    // Shutdown telemetry providers
    await telemetryUtils.shutdown();
  });

  describe('startActiveSpan', () => {
    it('should create a span with the given name', async () => {
      await service.startActiveSpan('test-span', async (span) => {
        // Span is created
      });

      await telemetryUtils.waitForSpans(1);
      const spans = telemetryUtils.getSpansByName('test-span');

      expect(spans).toHaveLength(1);
      expect(spans[0].name).toBe('test-span');
    });

    it('should add attributes to the span', async () => {
      await service.startActiveSpan(
        'test-span-with-attrs',
        async (span) => {
          // Span is created with attributes
        },
        {
          'test.attribute': 'test-value',
          'test.number': 42
        }
      );

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('test-span-with-attrs')[0];

      expect(span.attributes['test.attribute']).toBe('test-value');
      expect(span.attributes['test.number']).toBe(42);
    });

    it('should set OK status on successful execution', async () => {
      await service.startActiveSpan('successful-span', async (span) => {
        return 'success';
      });

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('successful-span')[0];

      expect(span.status.code).toBe(SpanStatusCode.OK);
    });

    it('should record errors and set ERROR status on failure', async () => {
      const testError = new Error('Test error');

      try {
        await service.startActiveSpan('failing-span', async (span) => {
          throw testError;
        });
      } catch (error) {
        // Expected to throw
      }

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('failing-span')[0];

      expect(span.status.code).toBe(SpanStatusCode.ERROR);
      expect(span.status.message).toBe('Test error');

      // Check that error was recorded as an event
      const errorEvent = span.events.find(e => e.name === 'exception');
      expect(errorEvent).toBeDefined();
      expect(errorEvent?.attributes?.['exception.message']).toBe('Test error');
    });
  });

  describe('recordError', () => {
    it('should record error details on a span', async () => {
      const testError = new Error('Test error with stack');

      await service.startActiveSpan('span-with-error', async (span) => {
        service.recordError(span, testError);
      });

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('span-with-error')[0];

      expect(span.status.code).toBe(SpanStatusCode.ERROR);

      const exceptionEvent = span.events.find(e => e.name === 'exception');
      expect(exceptionEvent).toBeDefined();
      expect(exceptionEvent?.attributes?.['exception.message']).toBe('Test error with stack');
    });
  });

  describe('Business metrics', () => {
    it('should record product view metric', async () => {
      service.recordProductView('test-product');

      // Force flush to export metrics
      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('product.views');
      expect(metric).toBeDefined();
    });

    it('should record product search metric', async () => {
      service.recordProductSearch('test search term');

      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('product.searches');
      expect(metric).toBeDefined();
    });

    it('should record user registration metric', async () => {
      service.recordUserRegistration(true);
      service.recordUserRegistration(false);

      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('user.registrations');
      expect(metric).toBeDefined();
    });

    it('should record auth attempt metric', async () => {
      service.recordAuthAttempt('RSA', true);
      service.recordAuthAttempt('HMAC', false);

      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('auth.attempts');
      expect(metric).toBeDefined();
    });

    it('should record email send metric', async () => {
      service.recordEmailSend(true);

      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('email.sends');
      expect(metric).toBeDefined();
    });

    it('should record operation duration', async () => {
      service.recordOperationDuration('test.operation', 150.5);

      await telemetryUtils.getMetrics();

      const metric = await telemetryUtils.findMetricByName('operation.duration');
      expect(metric).toBeDefined();
    });
  });

  describe('setAttributes', () => {
    it('should set attributes on the current span', async () => {
      await service.startActiveSpan('span-with-dynamic-attrs', async () => {
        service.setAttributes({
          'dynamic.attr1': 'value1',
          'dynamic.attr2': 123
        });
      });

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('span-with-dynamic-attrs')[0];

      expect(span.attributes['dynamic.attr1']).toBe('value1');
      expect(span.attributes['dynamic.attr2']).toBe(123);
    });
  });

  describe('addEvent', () => {
    it('should add event to the current span', async () => {
      await service.startActiveSpan('span-with-event', async () => {
        service.addEvent('custom.event', {
          'event.detail': 'some detail'
        });
      });

      await telemetryUtils.waitForSpans(1);
      const span = telemetryUtils.getSpansByName('span-with-event')[0];

      const customEvent = span.events.find(e => e.name === 'custom.event');
      expect(customEvent).toBeDefined();
      expect(customEvent?.attributes?.['event.detail']).toBe('some detail');
    });
  });
});
