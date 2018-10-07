const db = require('./../db/db');
const telegram = require('./../messangers/telegram');
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
    
async function create(req, res) {
    const id = req.params.guid;
    const ethereumAddress = req.body.ethereumAddress;
    const bitcoinAddress = req.body.bitcoinAddress;

    
    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            await db.user.create(value.telegramId, value.nickname, ethereumAddress, bitcoinAddress);
            telegram.sendMessage(value.telegramId, Keyboard.start, 'ℹ️ Main menu');
            client.del(id);
            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}

module.exports = {
    create: create
}