export interface CanonicalErpEvent {
  channel: 'erp';
  data: Record<string, unknown>;
  entityType: string;
  externalId: string;
  idempotencyKey: string;
  metadata: {
    adapter: string;
    adapterVersion: number;
    headers: Record<string, string>;
    rawEventType?: string;
    traceId?: string;
  };
  occurredAt: string;
  payloadVersion: string;
  receivedAt: string;
  source: string;
  sourceConnectionId?: string;
  tenantExternalId: string;
}
