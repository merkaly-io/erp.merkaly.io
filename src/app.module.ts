import { Module } from '@nestjs/common';
import { ERP_ADAPTERS } from './adapters/abstract.erp.adapter';
import { ContractErpAdapter } from './adapters/contract.erp.adapter';
import { ErpAdapterRegistry } from './adapters/erp-adapter.registry';
import { ErpController } from './controllers/erp.controller';
import { HealthController } from './controllers/health.controller';
import { ApiPublisher } from './publishers/api.publisher';
import { ErpIngestionService } from './services/erp-ingestion.service';

@Module({
  controllers: [ErpController, HealthController],
  providers: [
    ApiPublisher,
    ContractErpAdapter,
    ErpAdapterRegistry,
    ErpIngestionService,
    {
      provide: ERP_ADAPTERS,
      inject: [ContractErpAdapter],
      useFactory: (contract: ContractErpAdapter) => [contract],
    },
  ],
})
export class AppModule {}
