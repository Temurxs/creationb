import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { HttpModule } from '@nestjs/axios';
import { BotUpdate } from './bot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [  UserModule,
    ConfigModule.forRoot({
    isGlobal: true, // makes it available everywhere
    envFilePath: '.env', // optional if your file is named .env
  }),
  TelegrafModule.forRoot({
    token:"7953963265:AAFJd3qnSpSIvZF6WqY_x3zP874S4N1fep4"
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'dpg-d1l19emmcj7s73bmods0-a',
    port: 5432,
    username: 'postgres_yxzb_user',
    password: 'AiwEWwTGOdXsrEvw3ZfElc0phEnFj13t',
    database: 'postgres_yxzb',
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }),
  HttpModule,
  UserModule,],
  controllers: [AppController],
  providers: [AppService, BotUpdate],
})
export class AppModule {}
