import { Injectable } from '@nestjs/common';
import { ErpAdapterRegistry } from '../adapters/erp-adapter.registry';
import { IngestErpPayloadDto } from '../dto/ingest-erp-payload.dto';
import { ApiPublisher } from '../publishers/api.publisher';

@Injectable()
export class ErpIngestionService {
  public constructor(
    private readonly adapters: ErpAdapterRegistry,
    private readonly publisher: ApiPublisher,
  ) {}

  public async ingest(
    source: string,
    payload: IngestErpPayloadDto,
    headers: Record<string, string | string[] | undefined>,
  ) {
    const adapter = this.adapters.resolve(source);

    const message = adapter.normalize({
      payload,
      requestHeaders: this.normalizeHeaders(headers),
      source,
    });

    await this.publisher.publish(message);

    return message;
  }

  private normalizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, string> {
    return Object.entries(headers).reduce<Record<string, string>>(
      (result, [key, value]) => {
        if (typeof value === 'string') {
          result[key] = value;
        }

        if (Array.isArray(value)) {
          result[key] = value.join(', ');
        }

        return result;
      },
      {},
    );
  }
}
