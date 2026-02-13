import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { CloudProvidersMetaData } from './cloud.providers.metadata';
import { R_OK } from 'constants';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private cloudProviders = new CloudProvidersMetaData();

  constructor(private readonly telemetry: TelemetryService) {}

  async getFile(file: string): Promise<Readable> {
    return this.telemetry.startActiveSpan(
      'FileService.getFile',
      async (span) => {
        this.logger.log(`Reading file: ${file}`);

        const fileType = file.startsWith('/')
          ? 'absolute'
          : file.startsWith('http')
            ? 'remote'
            : 'relative';

        span.setAttributes({
          'file.path': file,
          'file.type': fileType,
          'operation.type': 'file_read'
        });

        if (file.startsWith('/')) {
          await fs.promises.access(file, R_OK);

          return fs.createReadStream(file);
        } else if (file.startsWith('http')) {
          const content = await this.cloudProviders.get(file);

          if (content) {
            return Readable.from(content);
          } else {
            throw new Error(`no such file or directory, access '${file}'`);
          }
        } else {
          file = path.resolve(process.cwd(), file);

          await fs.promises.access(file, R_OK);

          return fs.createReadStream(file);
        }
      }
    );
  }

  async deleteFile(file: string): Promise<boolean> {
    if (file.startsWith('/')) {
      throw new Error('cannot delete file from this location');
    } else if (file.startsWith('http')) {
      throw new Error('cannot delete file from this location');
    } else {
      file = path.resolve(process.cwd(), file);
      await fs.promises.unlink(file);
      return true;
    }
  }
}
