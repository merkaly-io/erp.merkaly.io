import { Module } from '@nestjs/common';
import { ERP_ADAPTERS } from './adapters/abstract.erp.adapter';
import { ContractErpAdapter } from './adapters/contract.erp.adapter';
import { ErpAdapterRegistry } from './adapters/erp-adapter.registry';
import { LinxErpAdapter } from './adapters/linx.erp.adapter';
import { ErpController } from './controllers/erp.controller';
import { HealthController } from './controllers/health.controller';
import { ApiPublisher } from './publishers/api.publisher';
import { ErpIngestionService } from './services/erp-ingestion.service';

@Module({
  controllers: [ErpController, HealthController],
  providers: [
    ApiPublisher,
    ContractErpAdapter,
    LinxErpAdapter,
    ErpAdapterRegistry,
    ErpIngestionService,
    {
      provide: ERP_ADAPTERS,
      inject: [LinxErpAdapter, ContractErpAdapter],
      useFactory: (linx: LinxErpAdapter, contract: ContractErpAdapter) => [
        linx,
        contract,
      ],
    },
  ],
})
export class AppModule {}
