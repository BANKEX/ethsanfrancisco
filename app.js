const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Handlers = require('./handlers/handlers');
const Text = require('./text');
const Stage = require("telegraf/stage");
const api = require('./api/api');

const stage = new Stage();

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.start((ctx) => Handlers.start(ctx));

bot.hears(Text.keyboard.start.button["0"], (ctx) => Handlers.createAccount(ctx));
bot.hears(Text.keyboard.start.button["1"], (ctx) => ctx.scene.enter("sendTransaction"));

stage.register(Handlers.sendTransaction);

bot.startPolling();

