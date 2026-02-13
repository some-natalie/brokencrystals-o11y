import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Product } from '../model/product.entity';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: EntityRepository<Product>,
    private readonly em: EntityManager,
    private readonly telemetry: TelemetryService
  ) {}

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async findAll(
    dateFrom: Date = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    ),
    dateTo: Date = new Date()
  ): Promise<Product[]> {
    return this.telemetry.startActiveSpan(
      'ProductsService.findAll',
      async (span) => {
        this.logger.debug(`Find all products from ${dateFrom} to ${dateTo}`);

        const diffInMilliseconds = Math.abs(
          dateTo.getTime() - dateFrom.getTime()
        );
        const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365);

        span.setAttributes({
          'products.date_range.from': dateFrom.toISOString(),
          'products.date_range.to': dateTo.toISOString(),
          'products.date_range.years': diffInYears
        });

        if (diffInYears >= 2) {
          span.addEvent('slow_query_detected', {
            'query.years': diffInYears,
            'query.sleep_ms': 2000
          });
          await this.sleep(2000);
          //This is to simulate a long query
        }

        const startTime = Date.now();
        const products = await this.productsRepository.find(
          {
            createdAt: { $gte: dateFrom, $lte: dateTo }
          },
          { orderBy: { createdAt: 'desc' } }
        );

        const duration = Date.now() - startTime;
        span.setAttributes({
          'products.count': products.length,
          'db.query.duration_ms': duration
        });

        this.telemetry.recordOperationDuration('products.findAll', duration, {
          date_range_years: diffInYears.toString()
        });

        return products;
      },
      {
        'operation.type': 'database.query',
        'db.entity': 'Product'
      }
    );
  }

  async findLatest(limit: number): Promise<Product[]> {
    return this.telemetry.startActiveSpan(
      'ProductsService.findLatest',
      async (span) => {
        this.logger.debug(`Find ${limit} latest products`);

        span.setAttribute('products.limit', limit);

        const products = await this.productsRepository.find(
          {},
          { limit, orderBy: { createdAt: 'desc' } }
        );

        span.setAttribute('products.count', products.length);

        return products;
      },
      {
        'operation.type': 'database.query',
        'db.entity': 'Product'
      }
    );
  }

  async searchByName(name: string): Promise<Product[]> {
    return this.telemetry.startActiveSpan(
      'ProductsService.searchByName',
      async (span) => {
        this.logger.debug(`Search products by name containing "${name}"`);

        span.setAttributes({
          'products.search.term': name,
          'operation.type': 'database.query',
          'db.entity': 'Product'
        });

        // Record search metric
        this.telemetry.recordProductSearch(name);

        try {
          const query = `
            select *
            from product
            where name ilike '%${name}%';
          `;
          const rows = await this.em.getConnection().execute<Product[]>(query);

          const products = rows.map((row: Product) =>
            this.em.map(Product, row)
          );

          span.setAttribute('products.count', products.length);

          return products;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `Failed to search products by name "${name}": ${message}`,
            err instanceof Error ? err.stack : undefined
          );

          // Error is automatically recorded by startActiveSpan
          throw err;
        }
      }
    );
  }

  async updateProduct(query: string): Promise<void> {
    return this.telemetry.startActiveSpan(
      'ProductsService.updateProduct',
      async (span) => {
        span.setAttributes({
          'operation.type': 'database.update',
          'db.entity': 'Product'
        });

        try {
          this.logger.debug(`Updating products table with query "${query}"`);
          await this.em.getConnection().execute(query);
          return;
        } catch (err) {
          this.logger.warn(`Failed to execute query. Error: ${err.message}`);
          // Error is automatically recorded by startActiveSpan
          throw new InternalServerErrorException(err.message);
        }
      }
    );
  }
}
