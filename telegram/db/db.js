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
            User.find({userID: userID}, (err, doc) => {
                if (err)
                    return err;
                const tokens = doc[0].tokenAddresses;
                tokens.push(tokenAddress);
                return new Promise((resolve, reject) => {
                    User.update({userID: userID}, {tokenAddresses: tokens}, (err, doc) => {
                        if (err)
                            reject(err);
                        resolve(doc);
                    });
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