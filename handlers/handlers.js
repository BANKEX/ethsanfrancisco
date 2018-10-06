const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Web3 = require('web3');
const guid = require('guid');
const redis = require("redis");
const bitcore = require('bitcore-lib');
const WizardScene = require("telegraf/scenes/wizard");
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');

const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/${process.env.INFURA_TOKEN}`));
const client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });

const keyLifeTime = 600; // in seconds

async function start(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    
    if (user)
        return ctx.reply(Text.keyboard.start.text, Markup
            .keyboard(Keyboard.start)
            .resize()
            .extra()
        )
    else
        return createAccount(ctx);
}

function createAccount(ctx) {
    const key = guid.create().value;
    
    client.set(key, JSON.stringify({
        userID: ctx.message.from.id,
        nickname: ctx.message.from.username,
        lifetime: Date.now() + (keyLifeTime * 1000)
    }), 'EX', keyLifeTime);
    
    return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet));
}

const sendTransaction = new WizardScene(
    "sendTransaction", ctx=> {
        ctx.reply(Text.dialog.sendTransaction["0"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.currency = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["1"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },  
    async ctx => { 
        const amount = ctx.message.text;
        const tickerFrom = currency == 'Ethereum' ? 'ETH' : 'BTC';
        const tickerTo = currency == 'Ethereum' ? 'ETH' : 'BTC';
        const amountInUSD = utils.course.convert(tickerFrom, tickerTo, amount);

        const key = guid.create().value;

        const userTo = ctx.session.to;
        const currency = ctx.session.currency;

        let toUserID;
        let toAddress;

        if (currency == 'Ethereum' && web3.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else if (currency == 'Bitcoin' && bitcore.Address.isValid(userTo)) {
            toAddress = userTo;
        } else {
            const user = await db.user.find.oneByID(ctx.session.to);
            toUserID = user.userID;
            toAddress = currency == 'Ethereum' ? user.ethereumAddress : user.bitcoinAddress;
        }
        
        client.set(key, JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: amountInUSD,
            lifetime: Date.now() + (keyLifeTime * 1000)
        }), 'EX', keyLifeTime);

        return ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction));

        ctx.scene.leave()
    },
)

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: ${user.ethereumAddress}\nBitcoin address: ${user.bitcoinAddress}`;
    return ctx.reply(text);
}

module.exports = {
    start: start,
    createAccount: createAccount,
    sendTransaction: sendTransaction,
    getAddresses: getAddresses
}