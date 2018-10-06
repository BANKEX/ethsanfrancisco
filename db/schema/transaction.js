const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    currency: {
        type: String
    },
    fromUserID: {
      type: Number
    },
    toUserID: {
        type: Number
    },
    toAddress: {
        type: String
    },
    amount: {
        type: Number,
    },
    amountInUSD: {
        type: Number
    },
    txHash: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Transaction', Transaction);