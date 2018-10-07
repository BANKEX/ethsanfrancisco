const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('./../text.json');

const start = [
    [Text.keyboard.start.button["0"]],
    [Text.keyboard.start.button["1"]],
    [Text.keyboard.start.button["2"]],
];

const account = [
    [Text.keyboard.account.button["0"]],
    [Text.keyboard.account.button["1"]],
    [Text.keyboard.start.button["3"]]
    [Text.back]
];

const currency = Extra
    .markdown()
    .markup((m) => m.inlineKeyboard([
            m.callbackButton(Text.inline_keyboard.sendTransaction.currency.button["0"].text, Text.inline_keyboard.sendTransaction.currency.button["0"].callback),
            m.callbackButton(Text.inline_keyboard.sendTransaction.currency.button["1"].text, Text.inline_keyboard.sendTransaction.currency.button["1"].callback)
    ]));

const token = Extra
        .markdown()
        .markup((m) => m.inlineKeyboard([
            m.callbackButton(Text.inline_keyboard.sendTransaction.token.button["0"].text, Text.inline_keyboard.sendTransaction.token.button["0"].callback),
            m.callbackButton(Text.inline_keyboard.sendTransaction.token.button["1"].text, Text.inline_keyboard.sendTransaction.token.button["1"].callback),
            m.callbackButton(Text.inline_keyboard.sendTransaction.token.button["2"].text, Text.inline_keyboard.sendTransaction.token.button["2"].callback),
            m.callbackButton(Text.inline_keyboard.sendTransaction.token.button["3"].text, Text.inline_keyboard.sendTransaction.token.button["3"].callback),
        ]));

const swapChooseType = Extra
    .markdown()
    .markup((m) => m.inlineKeyboard([
        m.callbackButton(Text.inline_keyboard.swap.button["0"].text, Text.inline_keyboard.swap.button["0"].callback),
        m.callbackButton(Text.inline_keyboard.swap.button["1"].text, Text.inline_keyboard.swap.button["1"].callback),
        m.callbackButton(Text.inline_keyboard.swap.button["2"].text, Text.inline_keyboard.swap.button["2"].callback),
    ]));

const create_wallet = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, `${Text.inline_keyboard.create_wallet["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, `${Text.inline_keyboard.send_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_atomic_swap = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.swap_utl.button.text, `${Text.inline_keyboard.swap_utl.button.callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

module.exports = {
    start: start,
    create_wallet: create_wallet,
    create_transaction: create_transaction,
    account: account,
    currency: currency,
    token: token,
    swapChooseType: swapChooseType,
    create_atomic_swap: create_atomic_swap
}