const LS = new LightySig();

const backendURL = 'https://afbdd361.ngrok.io';

const explorers = {
    "Bitcoin": {
        "mainnet": 'https://blockexplorer.com/tx/',
        "testnet": 'https://live.blockcypher.com/btc-testnet/tx/'
    },
    "BitcoinCash": {
        "mainnet": 'https://explorer.bitcoin.com/bch/tx/',
        "testnet": 'https://www.blocktrail.com/tBCC/tx/'
    },
    "Litecoin": {
        "mainnet": 'https://live.blockcypher.com/ltc/tx/',
        "testnet": 'https://chain.so/tx/LTCTEST/'
    },
    "Ethereum": {
        "mainnet": 'https://etherscan.io/tx/',
        "testnet": 'https://rinkeby.etherscan.io/tx/'
    },
    "Waves": {
        "mainnet": 'http://wavesexplorer.com/tx/',
        "testnet": 'https://testnet.wavesexplorer.com/tx'
    },
};

/**
 * Set network of all blockchains
 */
(function setNetworks() {
    LS.Ethereum.setRPCurl('https://rinkeby.infura.io/1u84gV2YFYHHTTnh8uVl');
    LS.Bitcoin.network.change('testnet');
    LS.BitcoinCash.network.change('testnet');
    LS.Litecoin.network.change('testnet');
    LS.Waves.network.change('testnet');
})();

/**
 * Allows to sign and send transaction into Blockchain
 * @returns {Promise<void>}
 */
async function sendTransaction() {
    const qrCode = await getFile();
    const qrData = await decodeQR(qrCode);
    const password = getPassword();
    const decryptedData = JSON.parse(decryptData(qrData, password));

    const transactionData = await getTransactionData();
    let {
        currency,
        to,
        value,
    } = transactionData;

    value = currency !== 'Ethereum' ? LS.utils.tw(value).toNumber() : LS.Ethereum.utils.tw(value).toNumber();

    try {
        const rawtx = (currency !== 'Waves' ?
            await LS[currency].transactions.signTransaction(decryptedData[currency], to, value) :
            await LS[currency].transactions.signTransaction(decryptedData[currency], to, 'Waves', value))[0];
        console.log(rawtx)

        openLoader();
        const txHash = await LS[currency].transactions.sendSigned(rawtx);

        // const response = await sendTransactionDataToServer(txHash);
        // if (response.error != null)
        //     throw new Error('This transaction does not save into bot');

        closeLoader();

        console.log(txHash)
        setTransactionURL(currency, 'testnet', txHash.txid);
    } catch (e) {
        addHint(e.message);
    }
}

/**
 * Allows to print url with transaction hash of chosen blockchain explorer
 * @param currency Chosen currency
 * @param network testnet or mainnet
 * @param txHash Hash of transaction
 */
function setTransactionURL(currency, network, txHash) {
    const url = explorers[currency][network] + txHash;
    addSuccess(`<a href="${url}">${url}</a>`);
}

/**
 * Send data of user to server
 * @param userId Telegram unique id
 * @param currency Sending currency
 * @param receiver address that will receive currency
 * @param value amount of currency
 * @returns {Promise<*>}
 */
async function sendTransactionDataToServer(txHash) {
    const id = parseURL(window.location);
    const url = `${backendURL}/api/blockchain/transaction/${id}`;
    return await query('PUT', url, JSON.stringify({"txHash": txHash}));
}

/**
 * Allows to get user password to decrypt cipher text
 * @returns {String} password
 */
function getPassword() {
    const password = document.getElementById('password').value;
    if (password == '')
        addHint('You do not enter password');
    else
        return password;
}

/**
 * Allows to decrypt data from QR code
 * @param cipher QR code data
 * @param password password
 * @returns {String} decrypted data
 */
function decryptData(cipher, password) {
    if (!password) {
        addHint('Enter password');
        throw Error('Enter password');
    }

    const bytes = CryptoJS.AES.decrypt(cipher, password);
    const data = bytes.toString(CryptoJS.enc.Utf8);

    if (data)
        return data;
    else
        throw Error('Incorrect data or password');
}

/**
 * Allows to get QR code data
 * @param qrCode IMG selector data
 * @return Cipher text
 */
function decodeQR(qrCode) {
    const img = {
        src: qrCode
    };

    return new Promise((resolve, reject) => {
        QCodeDecoder()
            .decodeFromImage(img, function (err, cipher) {
                if (err) {
                    addHint('Can not decode QR code');
                    reject(err);
                }
                else
                    resolve(cipher);
            });
    });
}

/**
 * Allows to get file
 */
function getFile() {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const file = document.querySelector('input[type=file]').files[0];
        if (!file) {
            addHint('You do not add a file');
            throw Error('Add file');
        }
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
}

(async function setTransactionData() {
    const transactionData = await getTransactionData();
    let {
        currency,
        from,
        to,
        nickname,
        value,
        valueInUsd
    } = transactionData;

    // const course = await LS.utils.course.convert(currency, 'US Dollar', value);

    document.getElementById('currency').innerText = currency;
    document.getElementById('from').innerText = from;
    document.getElementById('to').innerText = to;
    document.getElementById('nickname').innerText = nickname;
    document.getElementById('value').innerText = value;
    document.getElementById('usd-value').innerText = valueInUsd + ' $';
    closeLoader();
})();

/**
 * Allows to get transaction properties
 * @returns {Object} Transaction properties
 */
async function getTransactionData() {
    const shortlink = getShortlink();

    try {
        const queryURL = `${backendURL}/api/blockchain/transaction/${shortlink}`;
        const response = await query('GET', queryURL);

        if (response.error != null)
            return response.result;
        else {
            throw response.error;
        }
    } catch (e) {
        addError('Can not get transaction properties');
    }
}

/**
 * Allows to get shortlink
 * @returns {String} shortlink
 */
function getShortlink() {
    const demand = ['tx'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            addError('Transaction do not contains all parameters');
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.tx;
}

// function getTransactionData() {
//     const demand = ['userid', 'currency', 'from', 'to', 'nickname', 'value'];
//     const url = window.location;
//     const data = parseURL(url);
//
//     demand.forEach((property) => {
//         if (data[property] === undefined)
//             throw new Error('URL doesn\'t contain all properties');
//
//     });
//
//     data.value = data.currency !== 'Ethereum' ? LS.utils.tw(data.value).toNumber() : LS.Ethereum.utils.tw(data.value).toNumber();
//
//     return data;
// }

// /**
//  * Allows to parse url string
//  * @param url {Location} windows.location
//  * @returns {Object}
//  */
// function parseURL(url) {
//     const txID = url.pathname.split('/')[2].split('/')[0];
//     return txID;
// }

/**
 * Allows to parse url string
 * @param url {Location} windows.location
 * @returns {Object}
 */
function parseURL(url) {
    try {
        const params = url.search.substring(1);
        const paramsObject = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        return paramsObject;
    } catch (e) {
        addError('Can not get user identifier. Please, go back to the bot and try again');
        throw e;
    }
}

