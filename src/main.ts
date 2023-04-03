import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5001',
      package: 'third_party_service',
      protoPath: join(__dirname, './third-party-service.proto'),
    },
  });
  app.enableShutdownHooks();
  await app.startAllMicroservices();
}
bootstrap();
