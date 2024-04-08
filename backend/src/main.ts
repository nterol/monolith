import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { getPublicDir, startDevServer } from '@monolith/frontend';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  await startDevServer(app);

  app.useStaticAssets(getPublicDir(), {
    immutable: true,
    maxAge: '1y',
    index: false,
  });
  const selectedPort = process.env.PORT ?? 3000;

  console.log(`Running on port http://localhost:${selectedPort}`);
  await app.listen(selectedPort);
}
bootstrap();