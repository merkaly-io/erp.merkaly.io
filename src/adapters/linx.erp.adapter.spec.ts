import { LinxErpAdapter } from './linx.erp.adapter';

describe(LinxErpAdapter.name, () => {
  it('normalizes purchase payloads into the canonical purchase transaction event', () => {
    const adapter = new LinxErpAdapter();
    const receivedAt = '2026-04-15T12:00:00.000Z';
    const event = adapter.normalize({
      payload: {
        data: {
          currency: 'BRL',
          date: '2026-04-14T10:30:00.000Z',
          id: 'linx-purchase-123',
          items: [
            {
              id: 'item-1',
              productSku: 'SKU-001',
              quantity: 2,
              unitPrice: 12.5,
            },
          ],
          notes: 'Imported from Linx',
          supplier: {
            externalId: 'supplier-9',
            name: 'Acme Supplies',
          },
          total: 25,
        },
        entityType: 'ignored',
        externalId: 'ignored',
        tenantExternalId: 'tenant-1',
      },
      requestHeaders: {
        'content-type': 'application/json',
      },
      source: 'linx',
    });

    expect(event.channel).toBe('erp');
    expect(event.entityType).toBe('purchase.transaction.upserted');
    expect(event.externalId).toBe('linx-purchase-123');
    expect(event.idempotencyKey).toBe(
      'linx:purchase.transaction.upserted:linx-purchase-123',
    );
    expect(event.metadata.adapter).toBe('linx');
    expect(event.data).toMatchObject({
      currency: 'BRL',
      externalId: 'linx-purchase-123',
      notes: 'Imported from Linx',
      status: 'OPEN',
      supplier: {
        externalId: 'supplier-9',
        name: 'Acme Supplies',
      },
      totalAmount: 25,
    });
    expect(event.occurredAt).toBe('2026-04-14T10:30:00.000Z');
    expect(event.receivedAt).not.toBe(receivedAt);
  });
});
