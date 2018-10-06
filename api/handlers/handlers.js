const db = require('./../../db/db');
require('dotenv').config('./../../');
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

async function createAccount(req, res) {
    const id = req.params.guid;
    const ethereumAddress = req.body.ethereumAddress;
    const bitcoinAddress = req.body.bitcoinAddress;
    
    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            await db.user.create(value.userID, value.nickname, ethereumAddress, bitcoinAddress)
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

async function createTransaction(req, res) {
    const id = req.params.guid;
    const txHash = req.body.txHash;

    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            
            await db.transaction.create(value.currency, value.fromUserID, value.toUserID, value.toAddress, value.amount, value.amountInUSD, txHash);

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

async function getGuidLifetime(req, res) {
    const id = req.params.guid;

    getAsync(id)
        .then(value => {
            res.send({
                error: null,
                result: JSON.parse(value).lifetime
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
    createAccount: createAccount,
    createTransaction: createTransaction,
    getGuidLifetime: getGuidLifetime
}

