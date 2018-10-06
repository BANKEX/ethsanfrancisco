const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('./../text.json');

const start = [
    [Text.keyboard.start.button["0"]],
    [Text.keyboard.start.button["1"]],
];

const create_wallet = Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, Text.inline_keyboard.create_wallet["0"].callback),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction = Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, Text.inline_keyboard.send_transaction["0"].callback),
    // Markup.callbackButton('Back', 'delete')
]);

module.exports = {
    start: start,
    create_wallet: create_wallet,
    create_transaction: create_transaction
}