const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    _id: { 
        type: Schema.ObjectId,
        auto: true 
    },
    userID: {
        type: Number,
    },
    nickname: {
        type: String,
        default: ''
    },
    ethereumAddress: {
        type: String,
        default: ''
    },
    bitcoinAddress: {
        type: String,
        default: ''
    },
    tokenAddresses: {
      type: Array,
      default: [
        "0x55080ac40700BdE5725D8a87f48a01e192F660AF",
        "0x659c4206b2ee8CC00af837CddA132eb30fA58df8",
        "0x6b1224743CC0E5994d1B35f2b90A1A12a51044aC",
        "0xa8787F4faB0467B80d2F57722b1Bc8DDE707630E"
      ]
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);