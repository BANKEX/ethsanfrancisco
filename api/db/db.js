require('./db.connector');
const User = require('./schema/user');
const Transaction = require('./schema/transaction');

const user = {
    create: async (userID, nickname, ethereumAddress, bitcoinAddress) => User.create({
        userID: userID,
        nickname: nickname,
        ethereumAddress: ethereumAddress,
        bitcoinAddress: bitcoinAddress
    }, (err, doc) => {}),
    find: {
        all: () => {
            return new Promise((resolve, reject) => {
                User.find({}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        oneByID: (userID) => {
            return new Promise((resolve, reject) => {
                User.find({userID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
    },
    update: {
        addresses: (userID, ethereumAddress, bitcoinAddress) => {
            return new Promise((resolve, reject) => {
                User.update({userID: userID}, {ethereumAddress: ethereumAddress, bitcoinAddress: bitcoinAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        tokenAddresses: async (userID, tokenAddress) => {
            const user = await user.find.oneByID(userID)
            return new Promise((resolve, reject) => {
                user.update({userID: userID}, {tokenAddresses: user.tokenAddresses.push(tokenAddress)}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        }
    }
};

const transaction = {
    create: async (currency, fromUserID, toUserID, toAddress, amount, amountInUSD, txHash) => Transaction.create({
        currency: currency,
        fromUserID: fromUserID,
        toUserID: toUserID,
        toAddress: toAddress,
        amount: amount,
        amountInUSD: amountInUSD,
        txHash: txHash
    }, (err, doc) => {}),
    find: {
        toUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({toUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        fromUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({fromUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        }
    }
};


module.exports = {
    user: user,
    transaction: transaction
}