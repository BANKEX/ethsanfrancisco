const proxyContract = new web3.eth.Contract(ABI, proxyAddress);
const tokenSum = tw(1).toString();

//Call to get Rate
const getKyberExchangeRate = async () => {
    let rate = await proxyContract.methods.getExpectedRate(tokenKNC, tokenOMG, tokenSum).call({from: userAddress});
    return rate.expectedRate
};

//Call to get sum
//doesn't work yet
const getAllowanceAmount = async () => {  
    let sum = await proxyContract.methods.allowance(userAddress, proxyAddress).call({from: userAddress});
    console.log(sum);
    
};

//Trade with Kyber
const tradeKyberExchangeToEth = async () => {
    var rate = await getKyberExchangeRate();
    let transactionData = await proxyContract.methods.trade(
        tokenKNC, //ERC20 srcToken
        tokenSum, //uint srcAmount
        tokenOMG, //ERC20 destToken
        userAddress, //address destAddress
        "0", //uint maxDestAmount
        "1", //uint minConversionRate
        nullAddress //uint walletId
    ).encodeABI();

    //init tx
    const txParam = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)),
        to: proxyAddress,
        from: userAddress,
        data: transactionData,
        gasPrice: 50000000,
        gas: 210000
    };
    //create tx
    const tx = new ethereumjs.Tx(txParam);
    //sign tx
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    console.log('0x' + serializedTx.toString('hex'))
    //send tx
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
        console.log(err, doc)
    });
};
