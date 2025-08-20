import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { AbilityModule } from './ability/ability.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProjectsModule } from './modules/projects/projects.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { MatchesModule } from './modules/matches/matches.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchDocumentsModule } from './modules/research-documents/research-documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        username: configService.getOrThrow('MYSQL_USER'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    AbilityModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    ResearchDocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
