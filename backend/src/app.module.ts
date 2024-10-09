import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyTypeModule } from './property-type/property-type.module';
import { CityModule } from './city/city.module';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';
// import { DataSource } from 'typeorm';
import { StorageFileModule } from './storage-file/storage-file.module';
import { AuthModule } from './auth/auth.module';
import { DataSourceOptions } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';


export const getDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  // type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  database: configService.get<string>('DATABASE_SCHEMA'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASS'),
  // charset: 'utf8mb4_unicode_ci',
  // timezone: '+00:00',
  // ssl: {
  //   // ca: readFileSync(join(__dirname, '../cacert-2023-05-30.pem')),
  //   rejectUnauthorized: false,
  // },
  // extra: {
  //   charset: 'utf8mb4_unicode_ci',
  // },
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy(),
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),

    EventEmitterModule.forRoot(),
    PropertyTypeModule,
    CityModule,
    PropertyModule,
    UserModule,
    AgentModule,
    StorageFileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
}
