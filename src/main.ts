import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  require('dotenv').config()
  const { Telegraf } = require('telegraf');
  const bot = new Telegraf('7953963265:AAFJd3qnSpSIvZF6WqY_x3zP874S4N1fep4'); // Initialize the bot with the token from environment variables

    // ✅ Set webhook URL (once when server starts)
    await bot.telegram.setWebhook('https://creationb.onrender.com');

    // ✅ Attach webhook route to Express
    const server = app.getHttpAdapter().getInstance();
    server.use(bot.webhookCallback('/telegram'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
