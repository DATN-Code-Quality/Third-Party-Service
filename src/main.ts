import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from './logger/logger.service';

dotenv.config();

async function bootstrap() {
  const useCustomLogger = process.env.USE_CUSTOME_LOGGER === 'true';

  const app = await NestFactory.create(AppModule, {
    bufferLogs: useCustomLogger,
  });
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5001',
      package: 'third_party_service',
      protoPath: join(__dirname, './third-party-service.proto'),
      loader: { keepCase: true },
    },
  });
  app.enableShutdownHooks();

  if (useCustomLogger) {
    app.useLogger(app.get(Logger));
  }

  app.init();

  await app.startAllMicroservices();
}
bootstrap();
