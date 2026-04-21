import { NotFoundException } from '@nestjs/common';
import { ContractErpAdapter } from './contract.erp.adapter';
import { ErpAdapterRegistry } from './erp-adapter.registry';
import { LinxErpAdapter } from './linx.erp.adapter';

describe(ErpAdapterRegistry.name, () => {
  it('prefers the Linx adapter for linx sources and keeps the contract fallback', () => {
    const registry = new ErpAdapterRegistry([
      new LinxErpAdapter(),
      new ContractErpAdapter(),
    ]);

    expect(registry.resolve('linx')).toBeInstanceOf(LinxErpAdapter);
    expect(registry.resolve('anything-else')).toBeInstanceOf(
      ContractErpAdapter,
    );
  });

  it('throws when no adapter can handle the source', () => {
    const registry = new ErpAdapterRegistry([]);

    expect(() => registry.resolve('linx')).toThrow(NotFoundException);
  });
});
