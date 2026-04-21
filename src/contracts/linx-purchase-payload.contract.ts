export interface LinxPurchaseItemPayload {
  amount?: number;
  discount?: number;
  externalId?: string;
  id?: string;
  notes?: string;
  product?: {
    externalId?: string;
    id?: string;
    sku?: string;
    name?: string;
  };
  productExternalId?: string;
  productId?: string;
  productSku?: string;
  quantity?: number;
  sku?: string;
  subtotal?: number;
  total?: number;
  unitAmount?: number;
  unitPrice?: number;
  variantExternalId?: string;
  variantId?: string;
  warehouseExternalId?: string;
  warehouseId?: string;
}

export interface LinxPurchaseVendorPayload {
  email?: string;
  externalId?: string;
  id?: string;
  name?: string;
  phone?: string;
  taxId?: string;
}

export interface LinxPurchasePayload {
  currency?: string;
  createdAt?: string;
  date?: string;
  discount?: number;
  externalId?: string;
  id?: string;
  items?: LinxPurchaseItemPayload[];
  notes?: string;
  occurredAt?: string;
  number?: string;
  purchaseNumber?: string;
  reference?: string;
  lines?: LinxPurchaseItemPayload[];
  status?: string;
  subtotal?: number;
  products?: LinxPurchaseItemPayload[];
  supplier?: LinxPurchaseVendorPayload | string;
  supplierExternalId?: string;
  supplierName?: string;
  tax?: number;
  total?: number;
  vendor?: LinxPurchaseVendorPayload | string;
  vendorExternalId?: string;
  vendorName?: string;
}
