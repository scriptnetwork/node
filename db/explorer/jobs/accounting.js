const BigNumber = require('bignumber.js');
const rp = require('request-promise');
const COINBASE = 0;
const WEI = 1000000000000000000;
const SPAY_ID = '3822';

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

let txDao = null;
let acctTxDao = null;
let accountingDao = null;
let coinbaseApiKey = null;
let walletAddrs = null;

exports.InitializeForSPAYPrice = function (accountingDaoInstance, coinbaseApiKeyStr, walletAddresses) {
    accountingDao = accountingDaoInstance;
    coinbaseApiKey = coinbaseApiKeyStr;
    walletAddrs = walletAddresses;
}

exports.RecordSPAYPrice = async function () {
    let spayPrice = await getCoinbasePrice();
    let [startTime] = getDayTimes();

    for (let addr of walletAddrs) {
        const data = { date: startTime, addr: addr, price: spayPrice };
        accountingDao.insertAsync(data);
    }
}

exports.InitializeForSPAYEarning = function (transactionDaoInstance, accountTransactionDaoInstance, accountingDaoInstance, walletAddresses) {
    txDao = transactionDaoInstance;
    acctTxDao = accountTransactionDaoInstance;
    accountingDao = accountingDaoInstance;
    walletAddrs = walletAddresses;
}

exports.RecordSPAYEarning = async function () {
    let [startTime, endTime] = getDayTimes();
    for (let addr of walletAddrs) {
        processEarning(addr, startTime, endTime);
    }
}

function getDayTimes() {
    var date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    var endTime = date.getTime() / 1000;
    date.setDate(date.getDate() - 1);
    var startTime = date.getTime() / 1000;
    return [startTime, endTime];
}

async function processEarning(address, startTime, endTime) {
    let txHashes = await acctTxDao.getTxHashesAsync(address, startTime.toString(), endTime.toString(), COINBASE);
    let hashes = [];
    txHashes.forEach(function (txHash) {
        hashes.push(txHash.hash);
    });

    let txs = await txDao.getTransactionsByPkAsync(hashes);
    let totalSPAY = new BigNumber(0);
    for (let tx of txs) {
        for (let output of tx.data.outputs) {
            if (output.address === address) {
                totalSPAY = new BigNumber.sum(totalSPAY, new BigNumber(output.coins.SPAYWei));
                break;
            }
        }
    }

    const queryObj = { addr: address, date: startTime };
    const updateObj = { qty: Number(totalSPAY.dividedBy(WEI).toFixed(2)) };
    accountingDao.upsertAsync(queryObj, updateObj);
}

function getCoinbasePrice() {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            'id': SPAY_ID
        },
        headers: {
            'X-CMC_PRO_API_KEY': `190513df-6d8c-42a4-b344-e666a8a5323b`
        },
        json: true,
        gzip: true
    };

    return rp(requestOptions).then(res => {
        return res.data[SPAY_ID].quote.USD.price
    }).catch((err) => {
        console.log('Coinbase API call error:', err.message);
    });
}