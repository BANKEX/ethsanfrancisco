const mongoose = require("mongoose");
const config = require("../config/config");
const userName = config.DB_LOGIN;
const password = config.DB_PASSWORD;
const url = config.DB_URL;
const dataBase = config.DB_NAME;

const uri = `mongodb://${userName}:${password}@${url}/${dataBase}`;
console.log(uri);
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