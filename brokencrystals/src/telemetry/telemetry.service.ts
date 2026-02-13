import { Injectable } from '@nestjs/common';
import { trace, context, Span, SpanStatusCode, metrics } from '@opentelemetry/api';

/**
 * TelemetryService provides utilities for manual OpenTelemetry instrumentation
 * This service wraps the OpenTelemetry API for easier use in NestJS services
 */
@Injectable()
export class TelemetryService {
  private readonly tracer = trace.getTracer('brokencrystals-manual');
  private readonly meter = metrics.getMeter('brokencrystals-manual');

  // Business metrics
  private readonly productViewCounter = this.meter.createCounter(
    'product.views',
    {
      description: 'Number of product views',
      unit: '1'
    }
  );

  private readonly productSearchCounter = this.meter.createCounter(
    'product.searches',
    {
      description: 'Number of product searches',
      unit: '1'
    }
  );

  private readonly userRegistrationCounter = this.meter.createCounter(
    'user.registrations',
    {
      description: 'Number of user registrations',
      unit: '1'
    }
  );

  private readonly authAttemptCounter = this.meter.createCounter(
    'auth.attempts',
    {
      description: 'Number of authentication attempts',
      unit: '1'
    }
  );

  private readonly fileUploadCounter = this.meter.createCounter(
    'file.uploads',
    {
      description: 'Number of file uploads',
      unit: '1'
    }
  );

  private readonly emailSendCounter = this.meter.createCounter(
    'email.sends',
    {
      description: 'Number of emails sent',
      unit: '1'
    }
  );

  private readonly operationDurationHistogram = this.meter.createHistogram(
    'operation.duration',
    {
      description: 'Duration of operations in milliseconds',
      unit: 'ms'
    }
  );

  /**
   * Start a new span for tracing an operation
   * @param name - Name of the span
   * @param attributes - Optional attributes to add to the span
   * @returns The created span
   */
  startSpan(name: string, attributes?: Record<string, string | number | boolean>): Span {
    const span = this.tracer.startSpan(name);
    if (attributes) {
      span.setAttributes(attributes);
    }
    return span;
  }

  /**
   * Start an active span and execute a function within its context
   * This is the preferred method for most use cases as it handles context propagation
   * @param name - Name of the span
   * @param fn - Function to execute within the span context
   * @param attributes - Optional attributes to add to the span
   */
  async startActiveSpan<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.tracer.startActiveSpan(name, async (span) => {
      if (attributes) {
        span.setAttributes(attributes);
      }

      try {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        this.recordError(span, error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Record an error on a span
   * @param span - The span to record the error on
   * @param error - The error to record
   */
  recordError(span: Span, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    span.recordException({
      name: error instanceof Error ? error.name : 'Error',
      message: errorMessage,
      stack: errorStack
    });

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: errorMessage
    });

    // Add error event
    span.addEvent('exception', {
      'exception.type': error instanceof Error ? error.name : 'Error',
      'exception.message': errorMessage,
      'exception.stacktrace': errorStack || ''
    });
  }

  /**
   * Add an event to the current span
   * @param name - Name of the event
   * @param attributes - Optional attributes for the event
   */
  addEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    const span = trace.getSpan(context.active());
    if (span) {
      span.addEvent(name, attributes);
    }
  }

  /**
   * Set attributes on the current span
   * @param attributes - Attributes to set
   */
  setAttributes(attributes: Record<string, string | number | boolean>): void {
    const span = trace.getSpan(context.active());
    if (span) {
      span.setAttributes(attributes);
    }
  }

  /**
   * Get the current active span
   */
  getCurrentSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  // Metric recording methods

  /**
   * Record a product view
   * @param productName - Name of the product viewed
   */
  recordProductView(productName: string): void {
    this.productViewCounter.add(1, { 'product.name': productName });
  }

  /**
   * Record a product search
   * @param searchTerm - Search term used
   */
  recordProductSearch(searchTerm: string): void {
    this.productSearchCounter.add(1, { 'search.term': searchTerm });
  }

  /**
   * Record a user registration
   * @param success - Whether the registration was successful
   */
  recordUserRegistration(success: boolean): void {
    this.userRegistrationCounter.add(1, { success: success.toString() });
  }

  /**
   * Record an authentication attempt
   * @param method - Authentication method used
   * @param success - Whether the attempt was successful
   */
  recordAuthAttempt(method: string, success: boolean): void {
    this.authAttemptCounter.add(1, {
      'auth.method': method,
      success: success.toString()
    });
  }

  /**
   * Record a file upload
   * @param fileType - Type/extension of the file
   * @param sizeBytes - Size of the file in bytes
   */
  recordFileUpload(fileType: string, sizeBytes: number): void {
    this.fileUploadCounter.add(1, { 'file.type': fileType });
    this.operationDurationHistogram.record(sizeBytes, {
      operation: 'file.upload',
      'file.type': fileType
    });
  }

  /**
   * Record an email send
   * @param success - Whether the email was sent successfully
   */
  recordEmailSend(success: boolean): void {
    this.emailSendCounter.add(1, { success: success.toString() });
  }

  /**
   * Record operation duration
   * @param operationName - Name of the operation
   * @param durationMs - Duration in milliseconds
   * @param attributes - Optional attributes
   */
  recordOperationDuration(
    operationName: string,
    durationMs: number,
    attributes?: Record<string, string>
  ): void {
    this.operationDurationHistogram.record(durationMs, {
      operation: operationName,
      ...attributes
    });
  }
}
