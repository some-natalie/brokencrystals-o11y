import { Module, Global } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

/**
 * Global module that provides telemetry services across the application
 */
@Global()
@Module({
  providers: [TelemetryService],
  exports: [TelemetryService]
})
export class TelemetryModule {}
