window.web3 = new Web3(
    new Web3.providers.HttpProvider("https://rinkeby.infura.io/1u84gV2YFYHHTTnh8uVl")
);

/**
 //  * Convert Number to BigNumber
 //  * @param x Some number
 //  * @returns {*} BigNumber
 //  */
const tbn = (x) => new BigNumber(x);
const proxyContract = new web3.eth.Contract(ABI, proxyAddress);
const tokenSum = tw(0.5).toString();

/**
 * Return a rate
 * Using this function you can sign one or more tx in one time
 * @param tokenOne {String} Address of destination token
 * @param tokenTwo {String} Address of target token
 * @param sumInOne {String} Sum in wei ( Best is using tw(sum).toString() )
 * @param myAddress {String} Address of users account
 * @returns {*} Big number rate
 */
const getKyberExchangeRate = async (tokenOne, tokenTwo, sumInOne, myAddress) => {
    let rate = await proxyContract.methods.getExpectedRate(tokenOne, tokenTwo, sumInOne).call({from: myAddress});
    return rate.expectedRate;
};

/**
 * Return amount of eth (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param tokenTwo {String} Address of target token
 * @param tokenSum {String} Sum in wei ( Best is using tw(sum).toString() )
 * @returns {*} Big number type an amount of wei
 */
const predictEtherAmount = async (tokenTwo, tokenSum) => {
    let rate = fw(await getKyberExchangeRate(tokenEth, tokenTwo, tokenSum, userAddress));
    let neededSum = tbn(1).div(tbn(rate));
    let bnSum = tbn(tokenSum);
    let answer = neededSum.times(bnSum);
    return (answer);
};

/**
 * Return amount of tokens that you need to send if you want to get tokenSum amount of ethereum in wei
 * Using this function you can sign one or more tx in one time
 * @param destinationToken {String} Address of destination token
 * @param tokenSum {String} Sum in wei ( Best is using tw(sum).toString() )
 * @returns {*} Big number type an amount of wei
 */
const predictAmountFromToken = async (destinationToken, tokenSum) => {
    let rate = fw(await getKyberExchangeRate(destinationToken, tokenEth, tokenSum, userAddress));
    let neededSum = tbn(1).div(tbn(rate));
    let bnSum = tbn(tokenSum);
    let answer = neededSum.times(bnSum);
    return (answer);
};

/**
 * Return amount of target (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param destinationToken {String} Address of destination token
 * @param targetToken {String} Address of target token
 * @param tokenSum {String} Sum in wei ( Best is using tw(sum).toString() )
 * @returns {*} Big number type an amount of wei
 */
const predictTokenAmount = async (destinationToken, targetToken, tokenSum) => {
    let rate = fw(await getKyberExchangeRate(destinationToken, targetToken, tokenSum, userAddress));
    let neededSum = tbn(1).div(tbn(rate));
    let bnSum = tbn(tokenSum);
    let answer = neededSum.times(bnSum);
    return (answer);
};

/**
 * Return amount of eth (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param tokenAddress {String} Address of target token
 * @param etherSum {Number} amount of wei in Eth
 */
const swapEtherToToken = async (tokenAddress, etherSum) => {
    let sum = etherSum.toString();
    let transactionData = await proxyContract.methods.swapEtherToToken(
        tokenAddress,
        "0"
    ).encodeABI();
    const txParam = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)),
        to: proxyAddress,
        value: Number(sum),
        from: userAddress,
        data: transactionData,
        gasPrice: 5000000000,
        gas: 2100000
    };
    const tx = new ethereumjs.Tx(txParam);
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    // console.log('0x' + serializedTx.toString('hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
        console.log(err, doc)
    });
};

/**
 * Return amount of eth (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param tokenDestination {String} Address of destination token
 * @param destinationAmount {String} wei amount of destination tokens ( Best is using tw(sum).toString() )
 * @param targetToken {String} Address of target token
 */
const swapTokenToToken = async (tokenDestination, destinationAmount, targetToken) => {
    let allowanceAmount = await getAllowance(tokenDestination);

    if (Number(allowanceAmount) >= Number(destinationAmount)) {


        let transactionData = await proxyContract.methods.swapTokenToToken(
            tokenDestination,
            destinationAmount,
            targetToken,
            "0"
        ).encodeABI();
        const txParam = {
            nonce: Number(await web3.eth.getTransactionCount(userAddress)),
            to: proxyAddress,
            from: userAddress,
            data: transactionData,
            gasPrice: 5000000000,
            gas: 2100000
        };
        const tx = new ethereumjs.Tx(txParam);
        const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        // console.log('0x' + serializedTx.toString('hex'));
        const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
            console.log(err, doc)
        });
    } else {
        await approve(tokenDestination, destinationAmount);
        if (Number(await getAllowance(tokenDestination)) >= Number(destinationAmount)) {
            await swapTokenToToken(tokenDestination, destinationAmount, targetToken)
        }
        else {
            console.log("no tokens / money / else")
        }
    }
};

/**
 * Return amount of eth (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param tokenDestination {String} Address of destination token
 * @param destinationAmount {String} wei amount of destination tokens ( Best is using tw(sum).toString() )
 */
const swapTokenToEther = async (tokenDestination, destinationAmount) => {
    let allowanceAmount = await getAllowance(tokenDestination);

    if (Number(allowanceAmount) >= Number(destinationAmount)) {
        let transactionData = await proxyContract.methods.swapTokenToEther(
            tokenDestination,
            destinationAmount,
            "0"
        ).encodeABI();
        const txParam = {
            nonce: Number(await web3.eth.getTransactionCount(userAddress)),
            to: proxyAddress,
            from: userAddress,
            data: transactionData,
            gasPrice: 5000000000,
            gas: 2100000
        };
        const tx = new ethereumjs.Tx(txParam);
        const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        // console.log('0x' + serializedTx.toString('hex'));
        const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
            console.log(err, doc)
        });
    }
    else {
        await approve(tokenDestination, destinationAmount);
        if (Number(await getAllowance(tokenDestination)) >= Number(destinationAmount)) {
            await swapTokenToEther(tokenDestination, destinationAmount)
        }
        else {
            console.log("no tokens / money / else")
        }
    }
};

/**
 * Return amount of eth (in wei) that you need to get specified amount of tokens
 * Using this function you can sign one or more tx in one time
 * @param tokenAddress {String} Address of destination token
 * @return sum {*} Amount in wei that is allowed to use for TransferFrom
 */
const getAllowance = async (tokenAddress) => {
    let instance = new web3.eth.Contract(tokenABI, tokenAddress);
    let sum = await instance.methods.allowance(userAddress.toString(), proxyAddress.toString()).call({from: userAddress});
    return sum
};

/**
 * ERC20 approve
 * Using this function you can sign one or more tx in one time
 * @param tokenAddress {String} Address of destination token
 * @param tokenSum {*} Amount in wei to approve
 */
const approve = async (tokenAddress, tokenSum) => {
    let instance = new web3.eth.Contract(tokenABI, tokenAddress);
    let transactionData = await instance.methods.approve(proxyAddress, tokenSum).encodeABI();
    const txParam = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)),
        to: tokenAddress,
        from: userAddress,
        data: transactionData,
        gasPrice: 5000000000,
        gas: 2100000
    };
    const tx = new ethereumjs.Tx(txParam);
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    // console.log('0x' + serializedTx.toString('hex'));
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
    });
};

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
            first,
            second,
            amount,
            type
        } = transactionData;

        console.log('First token: ' + first)
        console.log('Second token: ' + second)
        console.log('Amount: ' + amount)

        // let transactionHash;

        amount = BL.Ethereum.utils.tw(amount).toString();

        const pvk = decryptedData['Ethereum'];

        pvtKey = pvk;

        userAddress = _Ethereum.account.getAddress(pvk);

        if (type == 'tt') {
            swapTokenToToken(first, amount, second);
        } else if (type == 'te') {
            swapTokenToEther(first, amount);
        } else if (type == 'et') {
            swapEtherToToken(first, amount);
        }

    // if (isToken != true) {
    //     setTransactionURL(currency, 'testnet', transactionHash);
    // } else {
    //     setTransactionURL('Ethereum', 'testnet', transactionHash);
    // }

    // const response = await sendTransactionDataToServer(transactionHash);

    closeLoader();
        alert('Great!')
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
// async function sendTransactionDataToServer(txHash) {
//     const guid = getShortlink();
//     const url = `${backendURL}/transaction/${guid}`;
//     return await query('PUT', url, JSON.stringify({"txHash": txHash}));
// }

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
        first,
        second,
        type,
        amount,
        nickname
    } = transactionData;

    document.getElementById('destinationToken').innerText = first;
    document.getElementById('targetToken').innerText = second;
    document.getElementById('destSum').innerText = amount;
    document.getElementById('nickname').innerText = nickname;

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
        const queryURL = `${backendURL}/swap/${shortlink}`;
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
