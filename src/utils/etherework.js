
if (typeof Web3 == 'undefined')
throw new Error('Fail to connect Web3 library\n\nCopy data from "https://raw.githubusercontent.com/ethereum/web3.js/develop/dist/web3.min.js" and add it to web3.min.js\n\nThen add <script src="./path/to/web3.min.js"></script> in your HTML body');


window.web3 = new Web3(
    new Web3.providers.HttpProvider("https://rinkeby.infura.io/1u84gV2YFYHHTTnh8uVl")
);


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
        // console.log(url)
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
            // console.log(privateKey)
            // console.log(to)
            // console.log(value)
            // console.log(data)
            const converted = toArrays(to, value, privateKey, data);
            const maxLength = converted.maxLength;
            const arrays = converted.arrays;
            const _receivers = arrays[0];
            const _values = arrays[1];
            const _privateKeys = arrays[2];
            const _datas = arrays[3];

            if (isLengthError(maxLength, ...arrays))
                return new Error(`You have ${_receivers.length} receivers, ${_values.length} values and ${_datas.length} datas and ${_privateKeys.length} privateKeys. It should be equal.`);
            console.log(_privateKeys)
            const addresses = _privateKeys.map(key => _Ethereum.account.getAddress(key))    ;

            const nonces = {};
            for (let i = 0; i < addresses.length; i++) {
                if (!nonces[addresses[i]])
                    nonces[addresses[i]] = await web3.eth.getTransactionCount(addresses[i]);
            }

            const signedTX = [];

            for (let i = 0; i < _receivers.length; i++) {
                // console.log(_values[i])
                const txParam = {
                    nonce: nonces[addresses[i]],
                    to: _receivers[i],
                    value: _values[i],
                    from: addresses[i],
                    data: _datas[i],
                    gasPrice: 10000,
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
            // console.log(instance)
            // console.log(methodName)
            if (!isArray(parameters[0]))
                parameters = [parameters];
            // console.log(...parameters[0])
            const data = instance[0].methods[methodName[0]](...parameters[0]).encodeABI();
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
            console.log(instance.methods)
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
        set: async (instances, methodNames, privateKeys, eth, parameters) => {
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

            // console.log(_parameters)

            const data = [];
            // for (let i in _methodsNames)
                data.push(_Ethereum.contract.getCallData(_instances, _methodsNames, ..._parameters));

            const contracts = _instances.map(instance => instance._address);

            const signedTransactions = await _Ethereum.transactions.signTransaction([_privateKeys[0]], [instances._address],[eth], data);
            // console.log("ggg "+signedTransactions[0])
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
