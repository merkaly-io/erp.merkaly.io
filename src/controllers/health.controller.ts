import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public index() {
    return {
      queue: process.env.API_QUEUE ?? 'api_queue',
      service: 'erp.merkaly.io',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
