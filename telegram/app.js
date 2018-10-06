const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Handlers = require('./handlers/handlers');
const Text = require('./text');
const Stage = require("telegraf/stage");

const stage = new Stage();

require('dotenv').config({path: "../.env"});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.start((ctx) => Handlers.start(ctx));

bot.hears(Text.keyboard.start.button["0"], (ctx) => Handlers.goToAccount(ctx));
bot.hears(Text.keyboard.start.button["1"], (ctx) => ctx.scene.enter("sendTransaction"));
bot.hears(Text.keyboard.account.button["0"], (ctx) => Handlers.getAddresses(ctx));
bot.hears(Text.back, (ctx) => Handlers.back(ctx));

stage.register(Handlers.sendTransaction);

bot.startPolling();

