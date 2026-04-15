import { CanonicalErpEvent } from '../contracts/canonical-erp-event.contract';
import { IngestErpPayloadDto } from '../dto/ingest-erp-payload.dto';

export const ERP_ADAPTERS = 'ERP_ADAPTERS';

export interface NormalizeErpPayloadContext {
  payload: IngestErpPayloadDto;
  requestHeaders: Record<string, string>;
  source: string;
}

export abstract class AbstractErpAdapter {
  public abstract canHandle(source: string): boolean;

  public abstract normalize(
    context: NormalizeErpPayloadContext,
  ): CanonicalErpEvent;
}
