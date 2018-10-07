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

