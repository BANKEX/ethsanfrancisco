class Blockchain {

    constructor() {
        this.Ethereum = _Ethereum;
        this.Bitcoin = _Bitcoin;
    }
}

/**
 * Convert Number to BigNumber
 * @param x Some number
 * @returns {*} BigNumber
 */
const tbn = (x) => new BigNumber(x);

const _Ethereum = {
    /**
     * Allows to change RPC url. Default: http://localhost:8545/
     * @param url New RPC URL
     */
    setRPCurl: (url) => {
        window.web3 = new Web3(new Web3.providers.HttpProvider(url))
    },
    account: {
        /**
         * Allows to create new private key
         * @returns {string} Private key
         */
        create: () => {
            let params = {
                keyBytes: 32,
                ivBytes: 16
            };
            let dk = keythereum.create(params);
            return "0x" + dk.privateKey.reduce((memo, i) => {
                return memo + ('0' + i.toString(16)).slice(-2);
            }, '');
        },
        /**
         * Allows to get address from private key
         * @param privateKey
         * @returns {*} Address
         */
        getAddress: (privateKey) => {
            let _privateKey = "";
            for (let i = 2; i < privateKey.length; i++) {
                _privateKey += privateKey[i];
            }
            return keythereum.privateKeyToAddress(_privateKey);
        }
    },
    balance: {
        /**
         * Allows to get address balance
         * @param address Address
         * @returns {Promise<*>} Balance (don't forget about 1e18)
         */
        getBalance: async (address) => {
            try {
                return await web3.eth.getBalance(address);
            } catch (e) {
                throw new Error('Can\'t get the balance. Please, check your internet connection');
            }
        }
    },
    transactions: {
        /**
         * Allows to sign any Ethereum transaction.
         * Using this function you can sign one or more tx in one time
         * @param privateKey {Array|String} of sender's Private Keys
         * @param to {Array|String} of the receivers (can be contract address)
         * @param value {Array|Number} of values (if it non-payable func add 0 to array's elements)
         * @param data {Array|String} of hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         * @returns {Promse<Array>} Signed hex strings
         */
        signTransaction: async (privateKey, to, value, data) => {
            const converted = toArrays(to, value, privateKey, data);
            const maxLength = converted.maxLength;
            const arrays = converted.arrays;
            const _receivers = arrays[0];
            const _values = arrays[1];
            const _privateKeys = arrays[2];
            const _datas = arrays[3];

            if (isLengthError(maxLength, ...arrays))
                return new Error(`You have ${_receivers.length} receivers, ${_values.length} values and ${_datas.length} datas and ${_privateKeys.length} privateKeys. It should be equal.`);

            const addresses = _privateKeys.map(key => _Ethereum.account.getAddress(key));

            const nonces = {};
            for (let i = 0; i < addresses.length; i++) {
                if (!nonces[addresses[i]])
                    nonces[addresses[i]] = await web3.eth.getTransactionCount(addresses[i]);
            }

            const signedTX = [];

            for (let i = 0; i < _receivers.length; i++) {
                const txParam = {
                    nonce: nonces[addresses[i]],
                    to: _receivers[i],
                    value: _values[i],
                    from: addresses[i],
                    data: _datas[i],
                    gasPrice: 0x3b9bca00,
                    gas: 210000
                };
                const tx = new ethereumjs.Tx(txParam);
                const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(_privateKeys[i].substring(2), 'hex');
                tx.sign(privateKeyBuffer);
                const serializedTx = tx.serialize();
                signedTX.push('0x' + serializedTx.toString('hex'));
                nonces[addresses[i]]++;
            }

            return signedTX;
        },
        /**
         * Allows to send signed transactions to blockchain
         * @param rawTransations Signed hex string
         * @returns {Promise<Array>} if success tx hash
         */
        sendSigned: async (rawTransations) => {
            if (typeof rawTransations != 'object')
                rawTransations = [rawTransations];

            const results = [];

            for (let i = 0; i < rawTransations.length; i++) {
                await web3.eth.sendSignedTransaction(rawTransations[i], (err, transactionHash) => {
                    if (err) {
                        results.push(err);
                        return;
                    }
                    results.push(transactionHash);
                });
            }
            return results;
        },
    },
    contract: {
        /**
         * Creates a new contract instance with all its methods and events defined in its json interface object
         * @param {Array} CONTRACT_ABI  application binary interface (look at remix)
         * @param {String} CONTRACT_ADDRESS Address of contract
         * @returns {Object} Contract instance
         */
        getInstance: (CONTRACT_ABI, CONTRACT_ADDRESS) => {
            const instance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            return instance;
        },
        /**
         * Allows you to receive hexadecimal data for a function call using a manual signature and sending a transaction
         * @param {Object} instance Contract instance
         * @param {String} methodName Name of the solidity function
         * @param {Array}parameters Solidity function parameters
         * @returns {*} hex string (func_sig + arg_1_as_bytes + arg_n_as_bytes)
         */
        getCallData: (instance, methodName, ...parameters) => {
            if (!isArray(parameters[0]))
                parameters = [parameters];
            const data = instance.methods[methodName](...parameters[0]).encodeABI();
            return data;
        },
        /**
         * Allows to call get function on contract
         * @param {Object} instance Contract instance
         * @param {String} methodName Name of the solidity function
         * @param {String} addressFrom Sender address
         * @param {Raw of sol func parameters} parameters Solidity function parameters
         * @returns {Promise<*>} Result
         */
        get: async (instance, methodName, addressFrom, ...parameters) => {
            const result = await instance.methods[methodName](...parameters).call({from: addressFrom});
            return result;
        },
        /**
         * Allows to call function that will write data to blockchain
         * @param {Array|Object} instances Contract instance
         * @param {Array|String} methodNames Contract method
         * @param {Array|String} privateKeys sender private key
         * @param {Array(Array)|Array} parameters
         * @return {Promise<Array>} tx hash
         */
        set: async (instances, methodNames, privateKeys, parameters) => {
            if (
                (!isArray(methodNames) && isObject(methodNames)) ||
                (!isArray(privateKeys) && isObject(privateKeys)) ||
                (!isArray(parameters[0]) && isObject(parameters[0]))
            ) {
                throw new Error('Parameters must have array or string type');
            }

            const converted = toArrays(instances, methodNames, privateKeys, parameters);
            const arrays = converted.arrays;
            const _instances = arrays[0];
            const _methodsNames = arrays[1];
            const _privateKeys = arrays[2];
            const _parameters = arrays[3];

            const data = [];
            for (let i in _methodsNames)
                data.push(_Ethereum.contract.getCallData(_instances[i], _methodsNames[i], _parameters[i]));

            const contracts = _instances.map(instance => instance._address);

            const signedTransactions = await _Ethereum.transactions.signTransaction(contracts, 0, _privateKeys, data);

            return await _Ethereum.transactions.sendSigned(signedTransactions);
        }
    },
    utils: {
        /**
         * Convert Number (or BN) to this * 10^18
         * @param x Some number
         * @returns {*} Number * 10^18
         */
        tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue(),

        /**
         * Convert from minimal Ethereum unit
         * @param x Some number
         * @returns {*} Converted number
         */
        fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber()
    }
};

const _Bitcoin = {
    network: {
        change: (network) => {
            const net = _Bitcoin.network.current = _Bitcoin.network[network];
            if (!net)
                throw new Error(`Use 'mainnet' or 'testnet', not ''${network}''`);
        },
        current: Bitcore.Networks.testnet,
        testnet: Bitcore.Networks.testnet,
        mainnet: Bitcore.Networks.livenet,
    },
    account: {
        /**
         * Allows to create new private key
         * @returns Private key
         */
        create: () => {
            return new Bitcore.PrivateKey(_Bitcoin.network.current).toString();
        },
        /**
         * Allows to get address from private key
         * @param privateKey
         * @returns {*} Address
         */
        getAddress: (privateKey) => {
            return new Bitcore.PrivateKey(privateKey).toAddress(_Bitcoin.network.current).toString();
        }
    },
    balance: {
        /**
         * Allows to get address balance
         * @param address Address
         * @returns {Promise<*>} Balance (don't forget about 1e18)
         */
        getBalance: async (address) => {
            if (!Bitcore.Address.isValid(address))
                throw new Error('Entered address is invalid');
            const URL = {
                livenet: 'https://blockexplorer.com/api/addr/' + address,
                testnet: 'https://testnet.blockexplorer.com/api/addr/' + address
            };
            try {
                const result = await query('GET', URL[_Bitcoin.network.current.name]);
                return result.balanceSat;
            } catch (e) {
                throw new Error('Can\'t get the balance. Please, check your internet connection');
            }
        },
        /**
         * Allows to get all unspent transaction outputs
         * @param address User address
         * @return {Promise<*|Array>} Array of UTXOs
         */
        getUTXOs: async (address) => {
            const URL = {
                livenet: 'https://blockexplorer.com/api/addr/' + address + '/utxo',
                testnet: 'https://testnet.blockexplorer.com/api/addr/' + address + '/utxo'
            }
            try {
                const result = await query('GET', URL[_Bitcoin.network.current.name]);
                return result;
            } catch (e) {
                throw new Error('Can\'t get UTXO. Please, check your internet connection');
            }
        }
    },
    transactions: {
        /**
         * Allows to sign transaction
         * @param {Array|String} privateKey
         * @param {Array|String} to
         * @param {Number} amount
         * @return {Promise<Array>} Hex data of signed transaction
         */
        signTransaction: async (privateKey, to, amount) => {
            if (isArray(privateKey) && hasDuplicates(privateKey))
                throw new Error('Private Keys cannot be duplicated');

            const fee = _Bitcoin.utils.fee;

            const convertedArray = toArrays(privateKey, to, amount);
            const arrays = convertedArray.arrays;
            const _privateKey = arrays[0];
            const _to = arrays[1];
            const _amount = arrays[2];

            if (isLengthError(convertedArray.maxLength, ...arrays))
                throw new Error(`Count of 'privateKey' is ${_privateKey.length}. Count of 'to' is ${_to.length}. Count of 'amount' is ${_amount.length}. But it should be equal.`);

            const values = {};
            const utxos = {};

            for (let i = 0; i < _privateKey.length; i++) {
                const tx_value = _amount[i];
                const address = _Bitcoin.account.getAddress(_privateKey[i]);
                if (utxos[address] === undefined)
                    utxos[address] = await _Bitcoin.balance.getUTXOs(address);
                values[address] = values[address] !== undefined ? tbn(values[address]).plus(tx_value).toNumber() : tx_value;
            }

            for (let address in values) {
                const balance = await _Bitcoin.balance.getBalance(address);
                const spendValue = tbn(values[address]).plus(fee);
                if (spendValue.gt(balance))
                    throw new Error(`Sending value is ${_utils.fw(spendValue)}. Balance of ${address} is ${_utils.fw(balance)}`);
            }

            const signedTransactions = [];

            if (
                typeof privateKey === 'string' ||
                (isArray(privateKey) && privateKey.length === 1)
            ) {
                const __privateKey = new Bitcore.PrivateKey(_privateKey[0]);
                const senderAddress = _Bitcoin.account.getAddress(__privateKey);
                const tx = new Bitcore.Transaction();
                const totalValue = totalAmount(_amount);
                let currentUTXOValue = 0;
                let inputs = utxos[senderAddress];

                inputs = inputs.sort(dynamicSort('-amount'));
                for (let i in inputs) {
                    const utxoValue = _utils.tw(inputs[i].amount).toNumber();
                    const input = {
                        "txId": inputs[i].txid,
                        "vout": inputs[i].vout,
                        "address": senderAddress.toString(),
                        "scriptPubKey": inputs[i].scriptPubKey,
                        "satoshis": utxoValue
                    };
                    tx.from(input);
                    currentUTXOValue = tbn(currentUTXOValue).plus(utxoValue);
                    if (isTxComplete(currentUTXOValue.toNumber(), totalValue))
                        break;
                }
                _to.forEach((recieverAddress, index) => tx.to(recieverAddress, _amount[index]));
                tx.fee(_Bitcoin.utils.fee);
                tx.change(senderAddress);
                tx.sign(__privateKey);
                signedTransactions.push(tx.toString());
            }

            return signedTransactions;
        },
        /**
         * Allows to send signed transaction to blockchain
         * @param rawTransaction {String} Hex data of signed transaction
         * @return {Promise<Object>} Object with tx hash
         */
        sendSigned: async (rawTransaction) => {
            if (typeof rawTransaction != 'string')
                throw new Error('Signed transaction can be a string');
            const URL = {
                livenet: 'https://insight.bitpay.com/api/tx/send',
                testnet: 'https://test-insight.bitpay.com/api/tx/send',
            };
            const data = `{\"rawtx\":\"${rawTransaction}\"}`;
            const response = await query('POST', URL[_Bitcoin.network.current], data);
            return response;
        }
    },
    utils: {
        fee: 100000,
        change: (fee) => {
            _Bitcoin.utils.fee = fee;
        }
    }
};

function clean(array, deleteValue) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == deleteValue) {
            array.splice(i, 1);
            i--;
        }
    }
    return array;
};
const isArray = (variable) => variable instanceof Array;
const toArray = (variable, length) => Array.from({length: length}, (v, k) => variable);
const toArrays = (...variables) => {
    const lengths = variables.map(elem => isArray(elem) ? elem.length : 1);
    const maxLength = lengths.reduce((acc, val) => val > acc ? val : acc, 0);
    const arrays = variables.map(elem => isArray(elem) ? elem : toArray(elem, maxLength));
    return {
        maxLength: maxLength,
        arrays: arrays
    };
};
const HexToUint8Array = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const txDataToTxHash = (txData) => BitcoinCash.crypto.Hash.sha256(BitcoinCash.crypto.Hash.sha256(HexToUint8Array(txData))).reverse().toString('hex');
const hasDuplicates = (array) => (new Set(array)).size !== array.length;
const isLengthError = (length, ...arrays) => arrays.reduce((acc, array) => acc === false && array.length === length ? false : true, false);
const isTxComplete = (utxoAmount, necessaryAmount) => utxoAmount >= necessaryAmount ? tbn(utxoAmount).minus(necessaryAmount).toNumber() : false;
const totalAmount = (amountArray) => amountArray.reduce((acc, val) => acc + val);
const isObject = (variable) => typeof variable == 'object';
const dynamicSort = (property) => {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};
const query = async (method, url, data) => {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "processData": false,
    };

    if (data) {
        settings.data = data;
        settings.headers = {
            "Content-Type": "application/json",
            // "Cache-Control": "no-cache"
        };
    }

    const result = await $.ajax(settings);
    return result;
};

const _utils = {
    /**
     * Convert Number (or BN) to this * 10^8
     * @param x Some number
     * @returns {*} Number * 10^8
     */
    tw: (x) => BigNumber.isBigNumber(x) ? x.times(1e8).integerValue() : tbn(x).times(1e8).integerValue(),

    /**
     * Convert from minimal Waves unit
     * @param x Some number
     * @returns {*} Converted number
     */
    fw: (x) => BigNumber.isBigNumber(x) ? x.times(1e-8).toNumber() : tbn(x).times(1e-8).toNumber()
};