import { Injectable } from '@nestjs/common';
import {
  AbstractErpAdapter,
  NormalizeErpPayloadContext,
} from './abstract.erp.adapter';
import { CanonicalErpEvent } from '../contracts/canonical-erp-event.contract';
import {
  LinxPurchaseItemPayload,
  LinxPurchasePayload,
} from '../contracts/linx-purchase-payload.contract';

@Injectable()
export class LinxErpAdapter extends AbstractErpAdapter {
  public canHandle(source: string): boolean {
    return source === 'linx';
  }

  public normalize(context: NormalizeErpPayloadContext): CanonicalErpEvent {
    const { payload, requestHeaders, source } = context;
    const receivedAt = new Date().toISOString();
    const purchase = payload.data as LinxPurchasePayload;
    const externalId = this.resolveExternalId(purchase, payload.externalId);
    const occurredAt = this.resolveOccurredAt(
      purchase,
      payload.occurredAt,
      receivedAt,
    );
    const items = this.normalizeItems(
      purchase.items ?? purchase.lines ?? purchase.products ?? [],
    );
    const subtotalAmount = this.resolveAmount(
      purchase.subtotal,
      items,
      'subtotal',
    );
    const totalAmount = this.resolveAmount(purchase.total, items, 'total');

    return {
      channel: 'erp',
      data: {
        currency: purchase.currency,
        discountAmount: purchase.discount ?? 0,
        externalId,
        items,
        notes: purchase.notes,
        occurredAt,
        reference: purchase.reference ?? null,
        status: purchase.status ?? 'OPEN',
        subtotalAmount,
        supplier: this.normalizeVendor(purchase),
        taxAmount: purchase.tax ?? 0,
        totalAmount,
      },
      entityType: 'purchase.transaction.upserted',
      externalId,
      idempotencyKey:
        payload.idempotencyKey ??
        `${source}:purchase.transaction.upserted:${externalId}`,
      metadata: {
        adapter: 'linx',
        adapterVersion: 1,
        headers: requestHeaders,
        rawEventType: payload.rawEventType ?? 'linx.purchase.transaction',
        traceId: payload.traceId,
      },
      occurredAt,
      payloadVersion: payload.payloadVersion ?? '1',
      receivedAt,
      source,
      sourceConnectionId: payload.sourceConnectionId,
      tenantExternalId: payload.tenantExternalId,
    };
  }

  private normalizeItems(items: LinxPurchaseItemPayload[]) {
    return items.map((item, index) => {
      const quantity = this.asNumber(item.quantity, 1);
      const unitAmount = this.asNumber(
        item.unitAmount ?? item.unitPrice ?? item.amount,
        0,
      );
      const subtotal = this.asNumber(
        item.subtotal ?? item.total,
        quantity * unitAmount,
      );

      return {
        externalId: item.externalId ?? item.id ?? `${index + 1}`,
        notes: item.notes,
        productExternalId:
          item.productExternalId ??
          item.productId ??
          item.product?.externalId ??
          item.product?.id ??
          item.product?.sku ??
          item.productSku ??
          item.sku ??
          null,
        quantity,
        subtotalAmount: subtotal,
        unitAmount,
        variantExternalId: item.variantExternalId ?? item.variantId ?? null,
        warehouseExternalId:
          item.warehouseExternalId ?? item.warehouseId ?? null,
      };
    });
  }

  private normalizeVendor(purchase: LinxPurchasePayload) {
    const vendor =
      typeof purchase.vendor === 'object' && purchase.vendor !== null
        ? purchase.vendor
        : typeof purchase.supplier === 'object' && purchase.supplier !== null
          ? purchase.supplier
          : undefined;

    return {
      email: vendor?.email ?? null,
      externalId:
        vendor?.externalId ??
        vendor?.id ??
        purchase.vendorExternalId ??
        purchase.supplierExternalId ??
        null,
      name:
        vendor?.name ?? purchase.vendorName ?? purchase.supplierName ?? null,
      phone: vendor?.phone ?? null,
      taxId: vendor?.taxId ?? null,
    };
  }

  private resolveExternalId(purchase: LinxPurchasePayload, fallback: string) {
    return (
      purchase.externalId ??
      purchase.id ??
      purchase.purchaseNumber ??
      purchase.number ??
      fallback
    );
  }

  private resolveOccurredAt(
    purchase: LinxPurchasePayload,
    fallback: string | undefined,
    receivedAt: string,
  ) {
    return (
      purchase.occurredAt ??
      purchase.createdAt ??
      purchase.date ??
      fallback ??
      receivedAt
    );
  }

  private resolveAmount(
    declaredAmount: number | undefined,
    items: Array<{ subtotalAmount: number }>,
    kind: 'subtotal' | 'total',
  ) {
    if (typeof declaredAmount === 'number') {
      return declaredAmount;
    }

    const itemTotal = items.reduce((sum, item) => sum + item.subtotalAmount, 0);

    return kind === 'subtotal' ? itemTotal : itemTotal;
  }

  private asNumber(value: unknown, fallback: number) {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : fallback;
  }
}
