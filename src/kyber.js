const proxyContract = new web3.eth.Contract(ABI, proxyAddress);
const kyberToken = new web3.eth.Contract(tokenABI, tokenKNC);
const tokenSum = tw(0.01).toString();


// //Approve
// const approveKyber = async () => {
//     let txData = await kyberToken.methods.approve(tokenKNC, tokenSum).encodeABI()
//     console.log(txData)
//     //init tx
//     const txParam = {
//         nonce: Number(await web3.eth.getTransactionCount(userAddress)),
//         to: proxyContract,
//         from: userAddress,
//         data: txData,
//         gasPrice: 50000000,
//         gas: 210000
//     };
//     //create tx
//     const tx = new ethereumjs.Tx(txParam);
//     //sign tx
//     const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
//     tx.sign(privateKeyBuffer);
//     const serializedTx = tx.serialize();
//     // console.log('0x' + serializedTx.toString('hex'));
//     //send tx
//     const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
//         console.log(err, doc)
//     });
//
//     console.log("Allowed sum " + (await kyberToken.methods.allowance(proxyContract)).toString())
//
// };
// //Call to get Rate
// const getKyberExchangeRate = async () => {
//     let rate = await proxyContract.methods.getExpectedRate(tokenKNC, tokenOMG, tokenSum).call({from: userAddress});
//     return rate.expectedRate
// };
//
// //Call to get sum
// //doesn't work yet
// const getAllowanceAmount = async () => {
//     let sum = await proxyContract.methods.allowance(userAddress, proxyAddress).call({from: userAddress});
//     // console.log(sum);
// };
//
// //Trade with Kyber
// const tradeKyberExchange = async () => {
//     let transactionData = await proxyContract.methods.trade(
//         tokenKNC, //ERC20 srcToken
//         tokenSum, //uint srcAmount
//         tokenOMG, //ERC20 destToken
//         userAddress, //address destAddress
//         "0", //uint maxDestAmount
//         await getKyberExchangeRate(), //uint minConversionRate
//         nullAddress //uint walletId
//     ).encodeABI();
//
//     //init tx
//     const txParam = {
//         nonce: Number(await web3.eth.getTransactionCount(userAddress)),
//         to: proxyAddress,
//         from: userAddress,
//         data: transactionData,
//         gasPrice: 50000000,
//         gas: 210000
//     };
//     //create tx
//     const tx = new ethereumjs.Tx(txParam);
//     //sign tx
//     const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
//     tx.sign(privateKeyBuffer);
//     const serializedTx = tx.serialize();
//     // console.log('0x' + serializedTx.toString('hex'));
//     //send tx
//     const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
//         console.log(err, doc)
//     });
// };

//Swap ether
const swapEtherToToken = async () => {
    console.log(proxyContract.methods);
    let transactionData = await proxyContract.methods.swapEtherToToken(
        tokenKNC,
        "0"
    );
    //init tx
    const txPar = {
        nonce: Number(await web3.eth.getTransactionCount(userAddress)),
        to: proxyAddress,
        value: tokenSum,
        from: userAddress,
        data: transactionData,
        gasPrice: 50000000,
        gas: 210000
    };

    //create tx
    const tx = new ethereumjs.Tx(txPar).toBuffer();
    //sign tx
    const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(pvtKey.substring(2), 'hex');
    tx.sign(privateKeyBuffer.toBuffer());
    const serializedTx = tx.serialize();
    // console.log('0x' + serializedTx.toString('hex'));
    //send tx
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, doc) => {
        console.log(err, doc)
    });
};
