const ABI = [
    {
        "constant": false,
        "inputs": [{"name": "alerter", "type": "address"}],
        "name": "removeAlerter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "reserve", "type": "address"}, {"name": "src", "type": "address"}, {
            "name": "dest",
            "type": "address"
        }, {"name": "add", "type": "bool"}],
        "name": "listPairForReserve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "bytes32"}],
        "name": "perReserveListedPairs",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getReserves",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "enabled",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "pendingAdmin",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getOperators",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "token", "type": "address"}, {"name": "amount", "type": "uint256"}, {
            "name": "sendTo",
            "type": "address"
        }],
        "name": "withdrawToken",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "maxGasPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "newAlerter", "type": "address"}],
        "name": "addAlerter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "negligibleRateDiff",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "feeBurnerContract",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "expectedRateContract",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "whiteListContract",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getUserCapInWei",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "newAdmin", "type": "address"}],
        "name": "transferAdmin",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_enable", "type": "bool"}],
        "name": "setEnable",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "claimAdmin",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}],
        "name": "isReserve",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getAlerters",
        "outputs": [{"name": "", "type": "address[]"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "src", "type": "address"}, {"name": "dest", "type": "address"}, {
            "name": "srcQty",
            "type": "uint256"
        }],
        "name": "getExpectedRate",
        "outputs": [{"name": "expectedRate", "type": "uint256"}, {"name": "slippageRate", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "uint256"}],
        "name": "reserves",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "newOperator", "type": "address"}],
        "name": "addOperator",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "reserve", "type": "address"}, {"name": "add", "type": "bool"}],
        "name": "addReserve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "operator", "type": "address"}],
        "name": "removeOperator",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_whiteList", "type": "address"}, {
            "name": "_expectedRate",
            "type": "address"
        }, {"name": "_feeBurner", "type": "address"}, {
            "name": "_maxGasPrice",
            "type": "uint256"
        }, {"name": "_negligibleRateDiff", "type": "uint256"}],
        "name": "setParams",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "src", "type": "address"}, {"name": "dest", "type": "address"}, {
            "name": "srcQty",
            "type": "uint256"
        }],
        "name": "findBestRate",
        "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "src", "type": "address"}, {"name": "srcAmount", "type": "uint256"}, {
            "name": "dest",
            "type": "address"
        }, {"name": "destAddress", "type": "address"}, {
            "name": "maxDestAmount",
            "type": "uint256"
        }, {"name": "minConversionRate", "type": "uint256"}, {"name": "walletId", "type": "address"}],
        "name": "trade",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "amount", "type": "uint256"}, {"name": "sendTo", "type": "address"}],
        "name": "withdrawEther",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "getNumReserves",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "token", "type": "address"}, {"name": "user", "type": "address"}],
        "name": "getBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "admin",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{"name": "_admin", "type": "address"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "sender", "type": "address"}, {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
        }],
        "name": "EtherReceival",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "sender", "type": "address"}, {
            "indexed": false,
            "name": "src",
            "type": "address"
        }, {"indexed": false, "name": "dest", "type": "address"}, {
            "indexed": false,
            "name": "actualSrcAmount",
            "type": "uint256"
        }, {"indexed": false, "name": "actualDestAmount", "type": "uint256"}],
        "name": "ExecuteTrade",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "reserve", "type": "address"}, {
            "indexed": false,
            "name": "add",
            "type": "bool"
        }],
        "name": "AddReserveToNetwork",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "reserve", "type": "address"}, {
            "indexed": false,
            "name": "src",
            "type": "address"
        }, {"indexed": false, "name": "dest", "type": "address"}, {"indexed": false, "name": "add", "type": "bool"}],
        "name": "ListReservePairs",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "token", "type": "address"}, {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
        }, {"indexed": false, "name": "sendTo", "type": "address"}],
        "name": "TokenWithdraw",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "amount", "type": "uint256"}, {
            "indexed": false,
            "name": "sendTo",
            "type": "address"
        }],
        "name": "EtherWithdraw",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "pendingAdmin", "type": "address"}],
        "name": "TransferAdminPending",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "newAdmin", "type": "address"}, {
            "indexed": false,
            "name": "previousAdmin",
            "type": "address"
        }],
        "name": "AdminClaimed",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "newAlerter", "type": "address"}, {
            "indexed": false,
            "name": "isAdd",
            "type": "bool"
        }],
        "name": "AlerterAdded",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": false, "name": "newOperator", "type": "address"}, {
            "indexed": false,
            "name": "isAdd",
            "type": "bool"
        }],
        "name": "OperatorAdded",
        "type": "event"
    }];
const proxyAddress = "0x818E6FECD516Ecc3849DAf6845e3EC868087B755";
const proxyContract = new web3.eth.Contract(ABI, proxyAddress);

//User data
const pvtKey = "0xc6692e4c48191184db0314e9dacb4a841802250008b7bcf90b1692eb62918aff";
const userAddress = "0x28dC6c304237055664a02846Af970928D9B07085";

// Utils for big numbers
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();

//Utils for trade
const tokenEth = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const tokenOMG = "0x4BFBa4a8F28755Cb2061c413459EE562c6B9c51b";
const tokenKNC = "0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6";
const tokenBITX = "0x7a17267576318efb728bc4a0833e489a46ba138f";
const tokenMOC = "0x1742c81075031b8f173d2327e3479d1fc3feaa76";
const tokenCOFI = "0xb91786188f8d4e35d6d67799e9f162587bf4da03";
const tokenBBO = "0xa94758d328af7ef1815e73053e95b5F86588C16D";
const tokenSTORM = "0x8FFf7De21de8ad9c510704407337542073FDC44b";
const tokenIOST = "0x27db28a6C4ac3D82a08D490cfb746E6F02bC467C";
const tokenLINK = "0xb4f7332ed719Eb4839f091EDDB2A3bA309739521";
const tokenSum = tw(0.0000000000001).toString();

//Call to get Rate
const getKyberExchangeRate = async () => {
    let rate = await proxyContract.methods.getExpectedRate(tokenEth, tokenOMG, tokenSum).call({from: userAddress});
    return rate.expectedRate
};

//Call to get sum
const getAllowanceAmount = async () => {
    let sum = await proxyContract.methods.allowance(userAddress, proxyAddress).call({from: userAddress});
    console.log(sum)
};

//Trade with Kyber
const tradeKyberExchangeToEth = async () => {
    let transactionData = await proxyContract.methods.trade(
        tokenEth, //ERC20 srcToken
        tokenSum, //uint srcAmount
        tokenOMG, //ERC20 destToken
        userAddress, //address destAddress
        tokenSum, //uint maxDestAmount
        await getKyberExchangeRate(), //uint minConversionRate
        "0x0000000000000000000000000000000000000000" //uint walletId
    ).encodeABI();

    console.log(tokenSum)
    const txParam = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)) + 1,
        contractAddress: proxyContract._address,
        value: tokenSum,
        from: userAddress,
        data: transactionData,
        gasPrice: 0x2,
        gas: 0x497C8
    };
    const tx = new ethereumjs.Tx(txParam);
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    console.log('0x' + serializedTx.toString('hex'))
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

    console.log(result);
};
