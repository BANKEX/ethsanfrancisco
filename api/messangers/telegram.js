const rp = require('request-promise');
require('dotenv').config();

const sendMessage = (userID, keyboard, text) => {
    var options = {
        method: 'POST',
        uri: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        body: {
            'chat_id': userID,
            'text': text,
            'parse_mode': 'Markdown',
            'reply_markup': JSON.stringify({
                "keyboard": keyboard,
                "resize_keyboard": true,
            }),
            'disable_web_page_preview': true
        },
        json: true
    };
    rp(options, (err, res, req) => {

    });
}

module.exports = {
    sendMessage: sendMessage
}