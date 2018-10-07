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
    const txHash = req.body.txHash;

    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            
            await db.transaction.create(value.currency, value.fromTelegramId, value.toTelegramId, value.toAddress, value.amount, value.amountInUSD, txHash);
            const userFrom = await db.user.find.oneByTelegramId(value.fromTelegramId);
            try {
                const msg = `*${userFrom.nickname}* send you ${value.amount} ${value.currency}`;
                telegram.sendMessage(value.toTelegramId, Keyboard.start, msg);
            } catch (e) {

            }

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

async function get(req,res) {
    const id = req.params.guid;

    getAsync(id)
        .then(value => {
            console.log(value)
            if (value != null)
                res.send({
                    error: null,
                    result: JSON.parse(value)
                });
            else
                res.send({
                    error: 'Deleted',
                    result: null
                });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        });
}

module.exports = {
    create: create,
    get: get
}