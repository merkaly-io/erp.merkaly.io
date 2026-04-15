import { HealthController } from './health.controller';

describe(HealthController.name, () => {
  it('returns service health metadata', () => {
    const controller = new HealthController();
    const result = controller.index();

    expect(result.service).toBe('erp.merkaly.io');
    expect(result.status).toBe('ok');
    expect(result.queue).toBeDefined();
  });
});
