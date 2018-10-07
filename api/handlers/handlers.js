const db = require('./../db/db');
const telegram = require('./../messangers/telegram');
require('dotenv').config({path: "./../.env"});
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const Keyboard = require('./../keyboard/keyboard');

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
    getGuidLifetime: getGuidLifetime
}

