import { Injectable } from '@nestjs/common';
import {
  AbstractErpAdapter,
  NormalizeErpPayloadContext,
} from './abstract.erp.adapter';
import { CanonicalErpEvent } from '../contracts/canonical-erp-event.contract';

@Injectable()
export class ContractErpAdapter extends AbstractErpAdapter {
  public canHandle(): boolean {
    return true;
  }

  public normalize(context: NormalizeErpPayloadContext): CanonicalErpEvent {
    const { payload, requestHeaders, source } = context;
    const receivedAt = new Date().toISOString();

    return {
      channel: 'erp',
      data: payload.data,
      entityType: payload.entityType,
      externalId: payload.externalId,
      idempotencyKey:
        payload.idempotencyKey ??
        `${source}:${payload.entityType}:${payload.externalId}`,
      metadata: {
        adapter: 'contract',
        adapterVersion: 1,
        headers: requestHeaders,
        rawEventType: payload.rawEventType,
        traceId: payload.traceId,
      },
      occurredAt: payload.occurredAt ?? receivedAt,
      payloadVersion: payload.payloadVersion ?? '1',
      receivedAt,
      source,
      sourceConnectionId: payload.sourceConnectionId,
      tenantExternalId: payload.tenantExternalId,
    };
  }
}
