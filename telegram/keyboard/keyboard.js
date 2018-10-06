const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('./../text.json');

const start = [
    [Text.keyboard.start.button["0"]],
    [Text.keyboard.start.button["1"]],
];

const account = [
    [Text.keyboard.account.button["0"]],
    [Text.keyboard.account.button["1"]],
    [Text.keyboard.account.button["2"]],
    [Text.back]
];

const create_wallet = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, `${Text.inline_keyboard.create_wallet["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, `${Text.inline_keyboard.send_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

module.exports = {
    start: start,
    create_wallet: create_wallet,
    create_transaction: create_transaction,
    account: account
}