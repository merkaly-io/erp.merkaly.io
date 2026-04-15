import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { IngestErpPayloadDto } from '../dto/ingest-erp-payload.dto';
import { ErpIngestionService } from '../services/erp-ingestion.service';

@Controller('erp')
export class ErpController {
  public constructor(private readonly ingestion: ErpIngestionService) {}

  @Post(':source/events')
  public async ingest(
    @Param('source') source: string,
    @Body() payload: IngestErpPayloadDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    const message = await this.ingestion.ingest(source, payload, headers);

    return {
      entityType: message.entityType,
      idempotencyKey: message.idempotencyKey,
      source: message.source,
      status: 'queued',
      tenantExternalId: message.tenantExternalId,
    };
  }
}
