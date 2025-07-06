import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { firstValueFrom } from "rxjs";
import { Context } from "telegraf";
import { User } from "./user/user.entity";
import { UserService } from "./user/user.service";


@Update()
export class BotUpdate{
    constructor(private readonly httpService: HttpService,
        private userService: UserService,
        private configService: ConfigService) {
        const port = this.configService.get<number>('PORT');
        const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN')
        // const db = this.configService.get<string>('DATABASE_URL');
        const apiKey = this.configService.get<string>('API-KEY');
        console.log(`App is running on port ${port}`);
        console.log(`Bot token is ${botToken}`);
        
      }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        const tgUser = ctx.from;
        if (!tgUser) {
          await ctx.reply('Error: Unable to retrieve user information.');
          return;
        }
        const userData: Partial<User> = {
          id: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
        };
      
        const user = await this.userService.findOrCreate(userData);
      
        await ctx.reply(`👋 Welcome, ${user.firstName}! Send me a movie name.`);
      }

    
      @On('text')

      
      async onMessage(@Ctx() ctx: Context) {
        if (!ctx.message || typeof ctx.message['text'] !== 'string') {
          await ctx.reply('Invalid message.');
          return;
        }
        const query = ctx.message['text'];
        const url = `https://api.themoviedb.org/3/search/movie?query=${query}`;
        const token = this.configService.get<string>('API-KEY');
    
        try {
          const response = await firstValueFrom(this.httpService.get(url, {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDg2ZDU3ZDc3NmZlNzRiMzE3MjNmNGZlZGIzZDhkYiIsIm5iZiI6MTc1MTcxNDY3My4zNiwic3ViIjoiNjg2OTBiNzEyZTMxNzY5Y2ZlNTFkNTdhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.DI5K_ktQxo-TfpbCx_GxAx1YcY-r9Wdliblz7pOnPi4`,
            },
          }));
          const results = response.data.results?.slice(0, 3);
    
          if (results && results.length > 0) {
            const tgUser = ctx.from;
            if (!tgUser) {
              await ctx.reply('Error: Unable to retrieve user information.');
              return;
            }
            const name = tgUser.first_name || 'User';
            await ctx.reply(`🔍 Ok ${name}, searching for "${query}"...`);
            const message = results
              .map((r) => `${r.original_title} \n ${r.overview} (${r.popularity})`)
              .join('\n\n');
              for (let i = 0; i < results.length; i++) {
                const movie = results[i];
                  var imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                  const caption = `🎬 *${movie.title}*\n🗓️ ${movie.release_date}\n⭐ ${movie.vote_average}\n\n${movie.overview}`;
                  await ctx.replyWithPhoto({ url: imageUrl }, { caption, parse_mode: 'Markdown' });
              }
          } else {
            await ctx.reply('❌No results found.');
          }
        } catch (error) {
          console.error(error);
          await ctx.reply('Error fetching data.');
        }
      }
    }
    