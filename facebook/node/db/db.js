require('./db.connector');
const User = require('./schema/user');
const Transaction = require('./schema/transaction');

const user = {
    create: async (telegramId, nickname, ethereumAddress, bitcoinAddress) => User.create({
        telegramId: telegramId,
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
        oneByTelegramId: (telegramId) => {
            return new Promise((resolve, reject) => {
                User.find({telegramId: telegramId}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        oneByNickname: (nickname) => {
            console.log(nickname)
            return new Promise((resolve, reject) => {
                User.find({nickname: new RegExp(nickname)}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            })
        }
    },
    update: {
        addresses: (telegramId, ethereumAddress, bitcoinAddress) => {
            return new Promise((resolve, reject) => {
                User.update({telegramId: telegramId}, {ethereumAddress: ethereumAddress, bitcoinAddress: bitcoinAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        tokenAddresses: async (telegramId, tokenAddress) => {
            const user = await user.find.oneByTelegramId(telegramId)
            return new Promise((resolve, reject) => {
                user.update({telegramId: telegramId}, {tokenAddresses: user.tokenAddresses.push(tokenAddress)}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        }
    }
};

const transaction = {
    create: async (currency, fromTelegramId, toTelegramId, toAddress, amount, amountInUSD, txHash) => Transaction.create({
        currency: currency,
        fromTelegramId: fromTelegramId,
        toTelegramId: toTelegramId,
        toAddress: toAddress,
        amount: amount,
        amountInUSD: amountInUSD,
        txHash: txHash
    }, (err, doc) => {}),
    find: {
        toTelegramId: (telegramId) => {
            return new Promise((resolve, reject) => {
                Transaction.find({toTelegramId: toTelegramId}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        fromTelegramId: (telegramId) => {
            return new Promise((resolve, reject) => {
                Transaction.find({fromTelegramId: telegramId}, (err, doc) => {
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