var rpc = require('../api/rpc.js');
var accountHelper = require('../helper/account');
var stakeHelper = require('../helper/stake');
var txHelper = require('../helper/transactions');
var fs = require('fs');
var { TxnTypes } = require('../helper/constants');
var scHelper = require('../helper/smart-contract');
var Logger = require('../helper/logger');
const { createIndexes } = require('../helper/utils');

var configFileName = 'config.cfg';
var initialAccounts = {};
var accountFileName = 'scpt-balance-height.json'
var progressDao = null;
var blockDao = null;
var transactionDao = null;
var accountDao = null;
var accountTxDao = null;
var stakeDao = null;
var checkpointDao = null;
var smartContractDao = null;
var dailyAccountDao = null;
var tokenDao = null;
var tokenSummaryDao = null;
var max_block_per_crawl = 300; //100;  //2  (v.2.5)
var target_crawl_height = 0;
var txs_count = 0;
var crawled_block_height_progress = 0;
var latest_block_height = 0;
var upsertTransactionAsyncList = [];
var validTransactionList = [];

exports.Initialize = function (progressDaoInstance, blockDaoInstance, transactionDaoInstance, accountDaoInstance, accountTxDaoInstance, stakeDaoInstance, checkpointDaoInstance, smartContractDaoInstance, dailyAccountDaoInstance, tokenDaoInstance, tokenSummaryDaoInstance, tokenHolderDaoInstance) {
    blockDao = blockDaoInstance;
    progressDao = progressDaoInstance;
    transactionDao = transactionDaoInstance;
    accountDao = accountDaoInstance;
    accountTxDao = accountTxDaoInstance;
    stakeDao = stakeDaoInstance;
    checkpointDao = checkpointDaoInstance;
    smartContractDao = smartContractDaoInstance;
    dailyAccountDao = dailyAccountDaoInstance;
    tokenDao = tokenDaoInstance;
    tokenSummaryDao = tokenSummaryDaoInstance;
    tokenHolderDao = tokenHolderDaoInstance;
}

exports.Execute = async function (network_id) {
    await progressDao.getProgressAsync(network_id).then(function (progressInfo) {
        Logger.log('Start a new crawler progress');
        txs_count = progressInfo.count;
        crawled_block_height_progress = progressInfo.height;
        Logger.log('DB transaction count progress: ' + txs_count.toString());
        Logger.log('crawled_block_height_progress: ', crawled_block_height_progress);
        return rpc.getPendingTxsAsync([])
    }).then(async function (data) {
        const result = JSON.parse(data);
        // console.log("result----->>>>>>>", result);
        const pendingTxList = result.result.tx_hashes;
        // Logger.log(`Number of PENDING transactions: ${pendingTxList.length}`);
        // const pendingTxList = ["12311", "23411", "34511", "45611", "56711", "67811", "78911", "89011", "90111", "12211", "12411", "12511"];
        let upsertTransactionAsyncList = [];
        for (let hash of pendingTxList) {
            const transaction = {
              hash: hash,
              status: 'pending'
            }
            const isExisted = await transactionDao.checkTransactionAsync(transaction.hash);
            if (!isExisted) {
                transaction.number = ++txs_count;
                validTransactionList.push(transaction);
                upsertTransactionAsyncList.push(transactionDao.upsertTransactionAsync(transaction));
            }
        }
        Logger.log(`Number of upsert PENDING transactions: ${upsertTransactionAsyncList.length}`);
        return Promise.all(upsertTransactionAsyncList)
    }).then(() => {
        return rpc.getStatusAsync([]) // read block height from chain
    }).then(function (data) {
        // Logger.log(data); //{"jsonrpc":"2.0","id":"V4dVP8fI","error":{"code":-32000,"message":"KeyNotFound"}}
        var result = JSON.parse(data);
        if (result.error) {
          // Handle the error
          Logger.log("Error found:", result.error);
          Logger.log("Error Code:", result.error.code);
          Logger.log("Error Message:", result.error.message);
        }
        else {
            latest_block_height = +result.result.latest_finalized_block_height;
            Logger.log('Latest block height: ' + latest_block_height);
            Logger.log('DB block height progress: ' + crawled_block_height_progress.toString());
            if (latest_block_height >= crawled_block_height_progress) {
                target_crawl_height = crawled_block_height_progress + max_block_per_crawl;
                if (latest_block_height < target_crawl_height) {
                    target_crawl_height = latest_block_height;
                }
                var getBlockAsyncList = [];
                var getVcpAsyncList = [];
                var getGcpAsyncList = [];
                var getEenpAsyncList=[]
                for (var i = crawled_block_height_progress + 1; i <= target_crawl_height; i++) {
                    // Logger.log('Crawling new block: ' + i.toString());
                    getBlockAsyncList.push(rpc.getBlockByHeightAsync([{ 'height': i.toString() ,'include_eth_tx_hashes': true }]));
                    getVcpAsyncList.push(rpc.getVcpByHeightAsync([{ 'height': i.toString() }]));
                    getGcpAsyncList.push(rpc.getGcpByHeightAsync([{ 'height': i.toString() }]));
                    getEenpAsyncList.push(rpc.getEenpByHeightAsync([{ 'height': i.toString() }]));
                }
                return Promise.all(getBlockAsyncList.concat(getVcpAsyncList).concat(getGcpAsyncList).concat(getEenpAsyncList))
            }
            else {
                Logger.info('Block crawling is up to date.');
            }
        }
    }).then(async function (blockDataList) {
        if (blockDataList) {
            var upsertBlockAsyncList = [];
            var upsertVcpAsyncList = [];
            var upsertGcpAsyncList = [];
            var updateEenpAsyncList = [];
            var upsertEenpAsyncList = [];
            var upsertTransactionAsyncList = [];
            var updateTokenList = [];
            var tokenTxs = [];
            var checkpoint_height, checkpoint_hash;
            var upsertCheckpointAsyncList = [];
            var stakes = { vcp: [], gcp: [], eenp: []  };
            // console.log("blockDataList------------->>>>", blockDataList)

            for (var i = 0; i < blockDataList.length; i++) {
                // Store the block data
                var result = JSON.parse(blockDataList[i]);
                // Logger.log(blockDataList[i]);
                if (result.result !== undefined) {
                    if (result.result.BlockHashVcpPairs) {  // handle vcp response
                        stakes.vcp = result.result.BlockHashVcpPairs;
                        await stakeDao.removeRecordsAsync('vcp');
                        result.result.BlockHashVcpPairs.forEach(vcpPair => {
                            vcpPair.Vcp.SortedCandidates.forEach(candidate => {
                            upsertVcpAsyncList.push(stakeHelper.updateStake(candidate, 'vcp', stakeDao));
                            })
                        })
                    }
                    else if (result.result.BlockHashGcpPairs) {
                        stakes.gcp = result.result.BlockHashGcpPairs;
                        await stakeDao.removeRecordsAsync('gcp');
                        result.result.BlockHashGcpPairs.forEach(gcpPair => {
                            if (Array.isArray(gcpPair.Gcp.SortedLightnings)) {
                                    gcpPair.Gcp.SortedLightnings.forEach(candidate => {
                                    upsertGcpAsyncList.push(stakeHelper.updateStake(candidate, 'gcp', stakeDao));
                                })
                            }
                        })
                    }
                    else if (result.result.BlockHashEenpPairs) {
                        stakes.eenp = result.result.BlockHashEenpPairs;
                        await stakeDao.removeRecordsAsync('eenp');
                        result.result.BlockHashEenpPairs.forEach(eenpPair => {
                            eenpPair.EENs.forEach(candidate => {
                                upsertEenpAsyncList.push(stakeHelper.updateStake(candidate, 'eenp', stakeDao));
                            })
                        })
                    }
                    else {  //handle block response
                        var txs = result.result.transactions;
                        if (txs) {
                            const blockInfo = {
                                epoch: result.result.epoch,
                                status: result.result.status,
                                height: result.result.height,
                                timestamp: result.result.timestamp,
                                hash: result.result.hash,
                                parent_hash: result.result.parent,
                                proposer: result.result.proposer,
                                state_hash: result.result.state_hash,
                                transactions_hash: result.result.transactions_hash,
                                num_txs: result.result.transactions.length,
                                txs: txHelper.getBriefTxs(result.result.transactions),
                                children: result.result.children,
                                hcc: result.result.hcc,
                                guardian_votes: result.result.guardian_votes
                            }
                            if (result.result.height % 100 === 1) {
                                checkpoint_height = blockInfo.height;
                                checkpoint_hash = blockInfo.hash
                            }
                            upsertBlockAsyncList.push(blockDao.upsertBlockAsync(blockInfo));
                            // Store the transaction data
                            // console.log("-------- txs--------", txs);
                            for (var j = 0; j < txs.length; j++) {
                                const transaction = {
                                    hash: txs[j].hash,
                                    eth_tx_hash: txs[j].eth_tx_hash,
                                    type: txs[j].type,
                                    data: txs[j].raw,
                                    block_height: blockInfo.height,
                                    timestamp: blockInfo.timestamp,
                                    receipt: txs[j].receipt,
                                    status: 'finalized'
                                }
                                const isExisted = await transactionDao.checkTransactionAsync(transaction.hash);
                                if (!isExisted) {
                                    transaction.number = ++txs_count;
                                    validTransactionList.push(transaction);
                                    upsertTransactionAsyncList.push(transactionDao.upsertTransactionAsync(transaction));
                                }
                                else {
                                    // TODO: get transaction's number
                                    const tx = await transactionDao.getTransactionByPkAsync(transaction.hash);
                                    transaction.number = tx.number;
                                    validTransactionList.push(transaction);
                                    upsertTransactionAsyncList.push(transactionDao.upsertTransactionAsync(transaction));
                                }
                                if (transaction.type === TxnTypes.SMART_CONTRACT) {
                                    console.log("SMART CONTRCT 1----->>>>>>>>>")
                                    tokenTxs.push(transaction);
                                    // updateTokenList.push(scHelper.updateToken(transaction, smartContractDao, tokenDao, tokenSummaryDao, tokenHolderDao));
                                }
                          // Logger.log('validTransactionList length', validTransactionList.length);
                          // Logger.log('upsertTransactionAsyncList length', upsertTransactionAsyncList.length);
                            }
                        }
                    }
                }
            }

            if (tokenTxs.length !== 0) {
                // console.log("SMART CONTRCT 2----->>>>>>>>>", tokenTxs)
                updateTokenList.push(scHelper.updateTokenByTxs(tokenTxs, smartContractDao, tokenDao, tokenSummaryDao, tokenHolderDao));
            }

        // console.log('stakes', stakes);
            if (stakes.vcp.length !== 0) {
                upsertGcpAsyncList.push(stakeHelper.updateTotalStake(stakes, progressDao))
            }
            if (checkpoint_hash) {
                for (var i = 0; i < blockDataList.length; i++) {
                    var result = JSON.parse(blockDataList[i]);
                    if (result.result !== undefined && result.result.BlockHashGcpPairs) {
                        result.result.BlockHashGcpPairs.forEach(gcpPair => {
                            if (gcpPair.BlockHash === checkpoint_hash) {
                                upsertCheckpointAsyncList.push(checkpointDao.insertAsync({
                                    height: parseInt(checkpoint_height),
                                    hash: checkpoint_hash,
                                    guardians: gcpPair.Gcp.SortedLightnings
                                }))
                            }
                        })
                    }
                }
            }
            Logger.log(`Number of upsert BLOCKS: ${upsertBlockAsyncList.length}`);
            Logger.log(`Number of upsert VCP: ${upsertVcpAsyncList.length}`);
            Logger.log(`Number of upsert GCP: ${upsertGcpAsyncList.length}`);
            Logger.log(`Number of upsert EENP: ${upsertEenpAsyncList.length}`);
            Logger.log(`Number of upsert check points: ${upsertCheckpointAsyncList.length}`);
            Logger.log(`Number of upsert TRANSACTIONS: ${upsertTransactionAsyncList.length}`);
            return Promise.all(upsertBlockAsyncList, upsertVcpAsyncList, upsertGcpAsyncList,upsertEenpAsyncList, upsertTransactionAsyncList, upsertCheckpointAsyncList)
        }
    }).then(() => {
        accountHelper.updateAccount(accountDao, accountTxDao, smartContractDao, dailyAccountDao, validTransactionList);
    }).then(async function () {
        validTransactionList = [];
        Logger.log('target_crawl_height: ', target_crawl_height, '. txs_count: ', txs_count)
        await progressDao.upsertProgressAsync(network_id, target_crawl_height, txs_count);
        Logger.log('Crawl progress updated to ' + target_crawl_height.toString());
        Logger.log('The end of a new crawler progress');
    }).catch(async function (error) {
        if (error) {
            if (error.message === 'No progress record') {
                Logger.log('Initializing progress record..');
                Logger.log('Loading config file: ' + configFileName)
                try {
                    config = JSON.parse(fs.readFileSync(configFileName));
                }
                catch (err) {
                    Logger.log('Error: unable to load ' + configFileName);
                    Logger.log(err);
                    process.exit(1);
                }
                const start_height = Number(config.blockchain.start_height) - 1 || 0;
                Logger.log(`start_height: ${start_height}, type: ${typeof start_height}`);
                progressDao.upsertProgressAsync(network_id, start_height, 0);

                Logger.log('Loading initial accounts file: ' + accountFileName)
                try {
                    initialAccounts = JSON.parse(fs.readFileSync(accountFileName));
                }
                catch (err) {
                    Logger.error('Error: unable to load ' + accountFileName);
                    Logger.error(err);
                    process.exit(1);
                }
                Object.keys(initialAccounts).forEach(function (address, i) {
                    setTimeout(function () {
                        Logger.log(i)
                        accountHelper.updateAccountByAddress(address, accountDao)
                    }, i * 10);
                })
                // return Promise.all(getAccountAysncList)
            }
            else {
                Logger.error(error);
            }
        }
    })
}

