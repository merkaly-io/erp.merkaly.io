import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractErpAdapter, ERP_ADAPTERS } from './abstract.erp.adapter';

@Injectable()
export class ErpAdapterRegistry {
  public constructor(
    @Inject(ERP_ADAPTERS)
    private readonly adapters: AbstractErpAdapter[],
  ) {}

  public resolve(source: string) {
    const adapter = this.adapters.find((candidate) =>
      candidate.canHandle(source),
    );

    if (!adapter) {
      throw new NotFoundException(
        `No ERP adapter registered for source "${source}"`,
      );
    }

    return adapter;
  }
}
