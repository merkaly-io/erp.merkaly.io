import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from './../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    // `supertest` exposes the Nest HTTP server as an untyped handle.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response: Response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    const body = response.body as { service: string; status: string };

    expect(body.service).toBe('erp.merkaly.io');
    expect(body.status).toBe('ok');
  });
});
