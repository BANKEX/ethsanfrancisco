const LS = new LightySig();

const backendURL = 'https://afbdd361.ngrok.io';

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

        closeLoader();

        if (--timer < 0) {
            clearInterval(bomb)
            // window.location.pathname = '/error'
        }
    }, 1000);
}

window.onload = async function () {
    const deleteDate = await getLinkLivetime();
    const now = Date.now();
    const difference = Number(deleteDate) - now;
    if (difference <= 0) {
        addError('The link was deleted or not found');
        // window.location.pathname = '/error';
        throw new Error('Can not get livetime of link');
    }
    const differenceInMinute = difference / 1000 / 60;
    const minutes = 60 * differenceInMinute,
        display = document.querySelector('#time');
    startTimer(minutes, display);
};

/**
 * Allows to get livetime of link
 * @returns {Promise<String>}
 */
async function getLinkLivetime() {
    const link = getShortlink();
    try {
        const response = await query('GET', `${backendURL}/api/blockchain/create/validator/${link}`);
        console.log(response)
        if (response.error){
            addError('Close page and try again');
            return response.error;
        }
        else
            return new Date(response.result).getTime();
    } catch (e) {
        addError('The link was deleted or not found');
        // window.location.pathname = '/error';
        throw new Error('Can not get livetime of link');
    }
}

/**
 * Generate QR code with encrypted private keys
 * @returns {Promise<void>}
 */
async function generatePicture() {
    const privateKeys = getAllPrivateKeys();
    const addresses = getAllAddresses(privateKeys);

    const password = checkPassword('password', 'error');
    if (!password)
        return;

    const encrypted = encryptAccount(privateKeys, password);

    const shortlink = getShortlink();
    openLoader();
    await sendAddresses(addresses, shortlink);

    const addressesText = '<br><b>Waves: </b>' + addresses.Waves + '<br>' +
        '<b>Ethereum: </b>' + addresses.Ethereum + '<br>' +
        '<b>Bitcoin: </b>' + addresses.Bitcoin + '<br>' +
        '<b>BitcoinCash: </b>' + addresses.BitcoinCash + '<br>' +
        '<b>Litecoin: </b>' + addresses.Litecoin;

    document.getElementById('main').innerHTML = `
        <br>
        <br>
        <p id="success"></p>
        <br>
        <img id="qr">
        <br>
        <p>Your address: <span>${addressesText}</span></p>
        <br>
        `;

    addSuccess('Save this QR code. It\'s your access to account');

    createQRCode('qr', encrypted);
    // closeLoader();
}

/**
 * Allows to send user's addresses to backend
 * @param addresses {Object} user's addresses
 * @param shortlink {String} guid
 * @returns {Promise<*>}
 */
async function sendAddresses(addresses, shortlink) {
    const queryURL = `${backendURL}/api/blockchain/create/${shortlink}`;
    const data = {
        bitcoinAddress: addresses.Bitcoin,
        bitcoinCashAddress: addresses.BitcoinCash,
        ethereumAddress: addresses.Ethereum,
        wavesAddress: addresses.Waves,
        litecoinAddress: addresses.Litecoin
    };
    try {
        const response = await query('PUT', queryURL, JSON.stringify(data));
        return response;
        if (response.error != null)
            throw new Error('Can not send addresses to data base');
    } catch (e) {
        addError('Please, try again');
        return e;
    }

}

/**
 * Create and push QR Code to tag
 * @param tagForQR {String} id of tag
 * @param data {String} QR code data
 */
function createQRCode(tagForQR, data) {
    (function () {
        const qr = new QRious({
            element: document.getElementById(tagForQR),
            value: data
        });
        qr.size = 300;
    })();
}

/**
 * Allows to encrypt user's privateKeys via his password
 * @param privateKeys {Object} user's private keys
 * @param password {String} encryption key
 * @returns {string} cypher text
 */
function encryptAccount(privateKeys, password) {
    if (password == '')
        throw new Error('Enter password');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(privateKeys), password);
    return encrypted.toString();
}

/**
 * Check password for wrong values
 * @param passwordElemID id of tag with password
 * @param errorElemID id of tag with error
 * @returns {boolean} true|false
 */
function checkPassword(passwordElemID, errorElemID) {
    const password = document.getElementById(passwordElemID).value;

    const checkObject = {
        0: {
            check: password != '',
            errorMessage: 'Enter password'
        },
        1: {
            check: password.length > 8,
            errorMessage: 'Password should be more than 8 characters'
        },
        2: {
            check: RegExp(/(?=.*[!@#$%^&*])/).test(password),
            errorMessage: 'The password must contain special characters'
        },
        3: {
            check: RegExp(/(?=.*[a-z])(?=.*[A-Z])/).test(password),
            errorMessage: 'The password must contain Latin letters of different registers'
        }
    }

    let err = false;
    for (let i in checkObject) {
        if (!checkObject[i].check) {
            err = true;
            $(`#${errorElemID}`).text(`${checkObject[i].errorMessage}`);
            break;
        } else {
            $(`#${errorElemID}`).text(``);
        }
    }

    return err == false ? password : false;
}

/**
 * Allows to get user's addresses from his private keys
 * @param privateKeys {Object} user's private keys
 */
function getAllAddresses(privateKeys) {
    const addresses = {};
    for (let currency in privateKeys)
        addresses[currency] = LS[currency].account.getAddress(privateKeys[currency]);
    return addresses;
}

/**
 * Allows to get user's private keys
 * @returns {{Waves: Object, Ethereum: (string), Bitcoin: (string), BitcoinCash: (string), Litecoin: (string)}}
 */
function getAllPrivateKeys() {
    // LS.Litecoin.network.change('mainnet');
    // LS.BitcoinCash.network.change('mainnet');
    // LS.Bitcoin.network.change('mainnet');
    // LS.Waves.network.change('mainnet');

    const waves = LS.Waves.account.create();
    const ethereum = LS.Ethereum.account.create();
    const bitcoin = LS.Bitcoin.account.create();
    const bitcoinCash = LS.BitcoinCash.account.create();
    const litecoin = LS.Litecoin.account.create();

    return {
        Waves: waves.phrase,
        Ethereum: ethereum,
        Bitcoin: bitcoin,
        BitcoinCash: bitcoinCash,
        Litecoin: litecoin
    }
}

/**
 * Allows to get shortlink
 * @returns {String} shortlink
 */
function getShortlink() {
    const demand = ['create'];
    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined)
            throw new Error('URL doesn\'t contain all properties');

    });

    return urlData.create;
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
        // window.location.pathname = '/error';
        throw e;
    }
}

