import 'dotenv/config';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';

const app = express();
app.use(express.static('public'));

const { BOT_TOKEN, MINI_APP_URL='http://localhost:3000', PORT=3000 } = process.env;
if (!BOT_TOKEN) { console.error('Missing BOT_TOKEN in .env'); process.exit(1); }

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply(
  "tell me a route like: 'fly from winnipeg to london with no more than 3 layovers'",
  Markup.keyboard([[{ text:'Open Mini App', web_app:{ url: MINI_APP_URL } }]]).resize()
));

bot.on('text', (ctx) => {
  ctx.reply(
    "top picks:\n• YWG → LON | 2 stops | 14h | 620 CAD\n• YWG → LON | 1 stop | 12h | 690 CAD\n• YWG → LON | 3 stops | 18h | 540 CAD",
    { reply_markup: { inline_keyboard: [[{ text: 'Open Mini App', web_app: { url: MINI_APP_URL } }]] } }
  );
});

bot.launch();
app.listen(PORT, () => console.log('web on', PORT, 'mini app:', MINI_APP_URL));
