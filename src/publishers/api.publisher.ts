import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CanonicalErpEvent } from '../contracts/canonical-erp-event.contract';

@Injectable()
export class ApiPublisher implements OnApplicationShutdown {
  private readonly logger = new Logger(ApiPublisher.name);

  private readonly client: ClientProxy = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      queue: process.env.API_QUEUE ?? 'api_queue',
      queueOptions: { durable: true },
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
    },
  });

  public async publish(event: CanonicalErpEvent) {
    this.logger.log(
      `Publishing canonical ERP event ${event.idempotencyKey} to API queue`,
    );

    await firstValueFrom(this.client.emit('erp.ingested', event));
  }

  public async onApplicationShutdown() {
    await this.client.close();
  }
}
