import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  require('dotenv').config()
  const { Telegraf } = require('telegraf');

  const bot = new Telegraf("7953963265:AAFJd3qnSpSIvZF6WqY_x3zP874S4N1fep4");

  bot.command('start', (ctx) => ctx.reply('Bot is running!'));
  bot.launch();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
