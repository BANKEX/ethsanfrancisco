const BL = new Blockchain();

const backendURL = 'http://localhost:3000';

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

(async () => {
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
 * Allows to get livetime of link
 * @returns {Promise<String>}
 */
async function getLinkLivetime() {
    const link = getShortlink();
    try {
        const response = await query('GET', `${backendURL}/guid/lifetime/${link}`);
        console.log(response)
        if (response.error) {
            addError('Close page and try again');
            return response.error;
        }

        return new Date(response.result).getTime();
    } catch (e) {
        addError('The link was deleted or not found');
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

    const password = checkPassword('password1', 'password2', 'error');

    if (!password)
        return;

    const encrypted = encryptAccount(privateKeys, password);

    openLoader();

    const shortlink = getShortlink();

    await sendAddresses(addresses, shortlink);

    document.getElementById('main').innerHTML = `
        <div class="container text-center">
            <br>
            <br>
            <h1>You are all set! This is your QR code</h1>
            <br>
            <h5>Don't loose it or you will loose everything</h5>
            <br>
            <br>
            <img id="qr">
            <br>
            <br>
            <p id="save-qr-code"></p>
        </div>
        <div class="row">
            <div class="col-12 text-center">
                <br>
                <br>
                <br>
                <br>
                <br>
                <h1>Here you can see your public addresses</h1>
                <br>
                <br>
                <p style="font-size: 22px; word-wrap: break-word">ETH: ${addresses.Ethereum}</p>
                <p style="font-size: 22px; word-wrap: break-word">BTC: ${addresses.Bitcoin}</p>
            </div>
        </div>
    `;

    createQRCode('qr', encrypted);
    addSaveButton();

    closeLoader();
}

/**
 * Allows to send user's addresses to backend
 * @param addresses {Object} user's addresses
 * @param shortlink {String} guid
 * @returns {Promise<*>}
 */
async function sendAddresses(addresses, guid) {
    const queryURL = `${backendURL}/create/${guid}`;
    const data = {
        bitcoinAddress: addresses.Bitcoin,
        ethereumAddress: addresses.Ethereum,
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
 * Add button. Push button and save qr code
 * @param data
 */
function addSaveButton() {
    const image = document.getElementById('qr');
    document.getElementById('save-qr-code').innerHTML = `<a href="${image.src}" download="ETHSanFrancisco.png"><button class="btn btn-success">Download</button></a>`;
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
function checkPassword(passwordElemID, repeatPasswordElemID, errorElemID) {
    const password = document.getElementById(passwordElemID).value;
    const repeatPassword = document.getElementById(repeatPasswordElemID).value;

    const checkObject = {
        0: {
            check: password != '',
            errorMessage: 'Enter password'
        },
        1: {
            check: password.length >= 8,
            errorMessage: 'Password should be equal or more than 8 characters'
        },
        // 2: {
        //     check: RegExp(/(?=.*[!@#$%^&*])/).test(password),
        //     errorMessage: 'The password must contain special characters'
        // },
        2: {
            check: RegExp(/[0-9]/).test(password),
            errorMessage: 'The password must contains numbers'
        },
        3: {
            check: RegExp(/(?=.*[a-z])(?=.*[A-Z])/).test(password),
            errorMessage: 'The password must contains Latin letters of different registers'
        },
        4: {
            check: password === repeatPassword,
            errorMessage: 'Passwords do not match'
        }
    }

    let err= false;
    for (let i in checkObject) {
        if (!checkObject[i].check) {
            err = true;
            $(`#${errorElemID}`).text(`${checkObject[i].errorMessage}`);
            break;
        } {
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
        addresses[currency] = BL[currency].account.getAddress(privateKeys[currency]);
    return addresses;
}

/**
 * Allows to get user's private keys
 * @returns {{Waves: Object, Ethereum: (string), Bitcoin: (string), BitcoinCash: (string), Litecoin: (string)}}
 */
function getAllPrivateKeys() {
    const ethereum = BL.Ethereum.account.create();
    const bitcoin = BL.Bitcoin.account.create();

    return {
        Ethereum: ethereum,
        Bitcoin: bitcoin,
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
    console.log(urlData)

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
        throw e;
    }
}

