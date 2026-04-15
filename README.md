# ERP Merkaly

Edge service for ERP ingestion in Merkaly.

`erp.merkaly.io` receives ERP-originated payloads, normalizes them into Merkaly's canonical ERP event contract, and publishes them to `api.merkaly.io` through RabbitMQ.

It does not update stock, orders, or business truth directly.
That responsibility stays in `api.merkaly.io`.

## Responsibilities

- receive ERP-originated payloads over HTTP
- resolve the ERP adapter for the source
- transform source payloads into a canonical Merkaly event
- publish canonical events to `api_queue`

## Non-responsibilities

- do not write domain truth to Merkaly databases
- do not decide stock transitions
- do not reconcile business entities
- do not replace `api.merkaly.io` as the operational source of truth

## Local development

```bash
pnpm install
pnpm dev
```

Default local port: `6507`

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `6507` | HTTP port for ERP ingestion |
| `RABBITMQ_URL` | `amqp://localhost:5672` | RabbitMQ connection URL |
| `API_QUEUE` | `api_queue` | Queue used to publish canonical ERP events for API consumption |

## HTTP endpoints

### `GET /health`

Returns a basic service health payload.

### `POST /erp/:source/events`

Receives a source-specific ERP payload that already matches the bootstrap contract:

```json
{
  "tenantExternalId": "tenant-123",
  "entityType": "purchase_order",
  "externalId": "erp-order-42",
  "payloadVersion": "1",
  "data": {
    "items": [
      {
        "sku": "ABC-001",
        "quantity": 3
      }
    ]
  }
}
```

The current bootstrap adapter is `contract`, which acts as a passthrough normalizer so real ERP-specific adapters can be added later without changing the publisher boundary.

## Published event pattern

The service emits the `erp.ingested` pattern to `api_queue`.

The event envelope includes:

- `channel`
- `source`
- `tenantExternalId`
- `entityType`
- `externalId`
- `idempotencyKey`
- `occurredAt`
- `payloadVersion`
- `data`
- `metadata`

## Design rule

`erp.merkaly.io` knows ERPs.
`api.merkaly.io` knows Merkaly.
