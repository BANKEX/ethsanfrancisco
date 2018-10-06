const BL = new Blockchain();

const backendURL = 'http://exp.bankex.team:3000';

const explorers = {
    "Bitcoin": {
        "mainnet": 'https://blockexplorer.com/tx/',
        "testnet": 'https://live.blockcypher.com/btc-testnet/tx/'
    },
    "Ethereum": {
        "mainnet": 'https://etherscan.io/tx/',
        "testnet": 'https://rinkeby.etherscan.io/tx/'
    },
}

/**
 * Start timer
 * @param duration {Number} timer time in minutes
 * @param display body block
 */
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const bomb = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (document.getElementById('loader').style.display == '')
            closeLoader();

        if (--timer < 0) {
            addError('The link was deleted');
            clearInterval(bomb)
        }
    }, 1000);
}

/**
 * Allows to get livetime of link
 * @returns {Promise<String>}
 */
async function getLinkLivetime() {
    const guid = getShortlink();
    try {
        const response = await query('GET', `${backendURL}/guid/lifetime/${guid}`);
        if (response.error){
            addError('Close page and try again');
            return response.error;
        }
        else
            return new Date(response.result).getTime();
    } catch (e) {
        addError('The link was deleted or not found');
        throw new Error('Can not get livetime of link');
    }
}

/**
 * Set network of all blockchains
 */
(function setNetworks() {
    BL.Ethereum.setRPCurl('https://rinkeby.infura.io/1u84gV2YFYHHTTnh8uVl');
    BL.Bitcoin.network.change('testnet');
})();

/**
 * Allows to sign and send transaction into Blockchain
 * @returns {Promise<void>}
 */
async function sendTransaction() {
    try {
        openLoader();
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

        value = currency !== 'Ethereum' ? BL.utils.tw(value).toNumber() : BL.Ethereum.utils.tw(value).toNumber();

        const rawtx = await BL[currency].transactions.signTransaction(decryptedData[currency], to, value);
        console.log(rawtx)

        let txHash;
        try {
            txHash = await BL[currency].transactions.sendSigned(rawtx);
        } catch (e) {
            addError('Try again later. Your last transaction could may be not confirmed');
            throw new Error('Try again later. Your last transaction could may be not confirmed');
        };

        $('.done').hide();

        let transactionHash;

        if (txHash.txid != undefined)
            if (txHash.txid.result == undefined)
                transactionHash = txHash.txid;
            else
                transactionHash = txHash.txid.result;
        else
            transactionHash = txHash[0];


        setTransactionURL(currency, 'testnet', transactionHash);

        const response = await sendTransactionDataToServer(transactionHash);

        closeLoader();

        console.log(txHash)

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
    const guid = getShortlink();
    const url = `${backendURL}/transaction/${guid}`;
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

    try {
        const bytes = CryptoJS.AES.decrypt(cipher, password);
        const data = bytes.toString(CryptoJS.enc.Utf8);

        if (data)
            return data;
        else
            throw Error('Incorrect QR Code or password');
    } catch (e) {
        throw Error('Incorrect QR Code or password')
    }
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
            addHint('You do not add QR Code');
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
        fromAddress,
        toAddress,
        toNickname,
        amount,
        amountInUSD
    } = transactionData;

    document.getElementById('currency').innerText = currency;
    document.getElementById('from').innerText = fromAddress;
    document.getElementById('to').innerText = toAddress;
    document.getElementById('nickname').innerText = toNickname;
    document.getElementById('value').innerText = amount;
    document.getElementById('usd-value').innerText = amountInUSD + ' $';

    const deleteDate = await getLinkLivetime();
    const now = Date.now();
    const difference = Number(deleteDate) - now;
    if (difference <= 0) {
        addError('The link was deleted or not found');
        throw new Error('Can not get livetime of link');
    }
    const differenceInMinute = difference / 1000 / 60;
    const minutes = 60 * differenceInMinute,
        display = document.querySelector('#time');
    startTimer(minutes, display);
})();

/**
 * Allows to get transaction properties
 * @returns {Object} Transaction properties
 */
async function getTransactionData() {
    const shortlink = getShortlink();

    try {
        const queryURL = `${backendURL}/transaction/${shortlink}`;
        const response = await query('GET', queryURL);

        if (response.error == null)
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
