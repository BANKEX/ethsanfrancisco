const mongoose = require("mongoose");
require('dotenv').config();
const userName = process.env.LOGIN;
const password = process.env.PASSWORD;
const url = process.env.URL;
const dataBase = process.env.DB;

const uri = `mongodb://${userName}:${password}@${url}/${dataBase}`;

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 1000, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true
};

const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));