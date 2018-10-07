const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const rp = require('request-promise');
const Web3 = require('web3');
const guid = require('guid');
const redis = require("redis");
const bitcore = require('bitcore-lib');
const WizardScene = require("telegraf/scenes/wizard");
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');
const token = require('./../tokens/tokens');

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
    console.log(key)
    return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet(key)));
}

const sendTransaction = new WizardScene(
    "sendTransaction", ctx => {
        ctx.reply(Text.dialog.sendTransaction["0"], { parse_mode: 'Markdown' });
        return ctx.wizard.next()
    },
    ctx=> {
        if (ctx.message.text == 'token') {
            ctx.session.isToken = true;
            ctx.reply(Text.dialog.sendTransaction["4"]);
        } else {
            ctx.session.isToken = false;
            ctx.reply(Text.dialog.sendTransaction["1"]);
        }
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.currency = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },  
    async ctx => {
        const currency = ctx.session.currency;
        const amount = ctx.message.text;
        const tickerFrom = currency == 'Ethereum' ? 'ETH' : 'BTC';
        const amountInUSD = await utils.course.convert(tickerFrom, "USD", amount);

        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        if (ctx.session.isToken)
            fromAddress = user[`ethereumAddress`];
        else
            fromAddress = user[`${currency.toLowerCase()}Address`];

        if (currency == 'Ethereum' && web3.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else if (currency == 'Bitcoin' && bitcore.Address.isValid(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            toUserID = user.userID;
            if (ctx.session.isToken) {
                toAddress = user.ethereumAddress;
            } else {
                toAddress = currency == 'Ethereum' ? user.ethereumAddress : user.bitcoinAddress;
            }
            checker = true;
        }
        
        client.set(key, JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUSD,
            lifetime: Date.now() + (keyLifeTime * 1000),
            isToken: ctx.session.isToken
        }), 'EX', keyLifeTime);

        return ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        ctx.scene.leave()
    },
)

const addToken = new WizardScene(
        "addToken", ctx=> {
            ctx.reply(Text.dialog.addToken["0"]);
            return ctx.wizard.next()
        },
        async ctx => {
            await db.user.update.tokenAddresses(ctx.message.from.id, ctx.message.text);
            ctx.reply(Text.dialog.addToken["1"]);
            ctx.scene.leave()
        }
)

function goToAccount(ctx) {
    return ctx.reply(Text.keyboard.account.text, Markup
        .keyboard(Keyboard.account)
        .resize()
        .extra()
    )
}

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\`\n\nBitcoin address: \`\`\`${user.bitcoinAddress}\`\`\``;
    return ctx.reply(text, { parse_mode: 'Markdown' });
}

function back(ctx) {
    start(ctx);
}

async function getBalances(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const balanceETH = await web3.eth.getBalance(user.ethereumAddress);

    const btcURL = `https://testnet.blockexplorer.com/api/addr/${user.bitcoinAddress}`;

    const balanceBTC = await rp({
        method: 'GET',
        uri: btcURL,
        json: true
    });

    let msg = `Ethereum balance: ${balanceETH/1e18}\n\nBitcoin balance: ${balanceBTC.balance}`;

    const tokens = user.tokenAddresses;

    for (let i in tokens) {
        const balance = await token.getBalance(user.ethereumAddress);
        msg += `\n\n${i} balance: ${balance/1e18}`;
    }

    ctx.reply(msg);
}

module.exports = {
    start: start,
    createAccount: createAccount,
    addToken: addToken,
    sendTransaction: sendTransaction,
    getAddresses: getAddresses,
    goToAccount: goToAccount,
    getBalances: getBalances,
    back: back
}