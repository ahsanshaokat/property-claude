import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import { PropertyTypeService } from './property-type/property-type.service';
import { CityService } from './city/city.service';
import { UserService } from './user/user.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Property Sonnet Backend')
    .setDescription('Property Sonnet API description')
    .setVersion('1.0')
    .addTag('property_finder')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('swagger', app, document);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-es-bundle-core.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.min.css',
      ],
    },
  });

  const allowedHosts = (process.env.CORS_ALLOWED_HOSTS as string) || '*';
  console.log('Allowd host : ', allowedHosts);

  app.useStaticAssets(path.join(__dirname, './public'));
  app.enableCors({
    origin: allowedHosts.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enable('trust proxy');

  //run db seeder
  const propertyTypeService = app.get(PropertyTypeService);
  const cityService = app.get(CityService);
  const userService = app.get(UserService);

  await Promise.all([
    propertyTypeService.insertAll(),
    cityService.insertAll(),
    userService.insertAll(),
  ]);

  const PORT = process.env.PORT || 7890;

  await app.listen(PORT, () => {
    return Logger.log(`Application started on port ${PORT}`);
  });
}
bootstrap();
