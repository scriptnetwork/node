var schedule = require('node-schedule');
var bluebird = require("bluebird");
var fs = require('fs');
var rpc = require('./api/rpc.js');
var Logger = require('./helper/logger');
var mongoClient = require('./mongo-db/mongo-client.js')
var progressDaoLib = require('./mongo-db/progress-dao.js');
var blockDaoLib = require('./mongo-db/block-dao.js');
var transactionDaoLib = require('./mongo-db/transaction-dao.js');
var accountDaoLib = require('./mongo-db/account-dao.js');
var accountTxDaoLib = require('./mongo-db/account-tx-dao.js');
var stakeDaoLib = require('./mongo-db/stake-dao.js');
var txHistoryDaoLib = require('./mongo-db/tx-history-dao.js');
var accountingDaoLib = require('./mongo-db/accounting-dao.js');
var checkpointDaoLib = require('./mongo-db/checkpoint-dao.js');
var smartContractDaoLib = require('./mongo-db/smart-contract-dao.js')
var activeAccountDaoLib = require('./mongo-db/active-account-dao')
var totalAccountDaoLib = require('./mongo-db/total-account-dao')
var dailyAccountDaoLib = require('./mongo-db/daily-account-dao.js')
var tokenDaoLib = require('./mongo-db/token-dao.js')
var tokenSummaryDaoLib = require('./mongo-db/token-summary-dao.js')
var tokenHolderDaoLib = require('./mongo-db/token-holder-dao.js')

var readBlockCronJob = require('./jobs/read-block.js');
var readTxHistoryJob = require('./jobs/read-tx-history.js');
var accountingJob = require('./jobs/accounting.js');
var accountJob = require('./jobs/read-accounts.js');

const { waitSync } = require('./waitSync.js'); // Adjust the path as needed

var config = null;
var configFileName = 'config.cfg';
var blockDao = null;

function setupGetBlockCronJob(mongoClient, network_id) {
  // initialize DAOs
    progressDao = new progressDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(progressDao);

    blockDao = new blockDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(blockDao);

    transactionDao = new transactionDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(transactionDao);

    accountDao = new accountDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(accountDao);

    accountTxDao = new accountTxDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(accountTxDao);

    stakeDao = new stakeDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(stakeDao);

    txHistoryDao = new txHistoryDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(txHistoryDao);

    accountingDao = new accountingDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(accountingDao);

    checkpointDao = new checkpointDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(checkpointDao);

    smartContractDao = new smartContractDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(smartContractDao);

    activeAccountDao = new activeAccountDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(activeAccountDao);

    totalAccountDao = new totalAccountDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(totalAccountDao);

    dailyAccountDao = new dailyAccountDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(dailyAccountDao);

    tokenDao = new tokenDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(tokenDao);

    tokenSummaryDao = new tokenSummaryDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(tokenSummaryDao);

    tokenHolderDao = new tokenHolderDaoLib(__dirname, mongoClient);
    bluebird.promisifyAll(tokenHolderDao);

    readBlockCronJob.Initialize(progressDao, blockDao, transactionDao, accountDao, accountTxDao, stakeDao, checkpointDao, smartContractDao, dailyAccountDao,tokenDao, tokenSummaryDao, tokenHolderDao);
    setTimeout(async function run() {
        await readBlockCronJob.Execute(network_id);
        setTimeout(run, 6000);
    }, 6000);

    readTxHistoryJob.Initialize(transactionDao, txHistoryDao);
    schedule.scheduleJob('0 0 0 * * *', readTxHistoryJob.Execute);

    accountingJob.InitializeForSPAYPrice(accountingDao, config.accounting.coinbase_api_key, config.accounting.wallet_addresses);
    schedule.scheduleJob('0 0 0 * * *', accountingJob.RecordSPAYPrice); // GMT mid-night

    accountingJob.InitializeForSPAYEarning(transactionDao, accountTxDao, accountingDao, config.accounting.wallet_addresses);
    schedule.scheduleJob('0 0 0 * * *', accountingJob.RecordSPAYEarning); // PST mid-night - need to adjust according to daylight saving changes

    accountJob.Initialize(dailyAccountDao, activeAccountDao, totalAccountDao, accountDao);
    activeAccountDao.getLatestRecordsAsync(1).then(() => {
        console.log("active job------->>>>>>>>>>>>>>>>>")}).catch(err => {
            console.log(`--> activeAccountDao.getLatestRecordsAsync err:`, err);
            if (err.message.includes('NO_RECORD')) {
                console.log("err message---", err)
                accountJob.Execute();
            }
    })

    schedule.scheduleJob('Record active accounts', '5 * * * * *' , () => 'America/Tijuana', accountJob.Execute); // PST mid-night
}

async function wait_until_sync() {
    console.log("Starting sync check loop...");
    starting_height=1;
    while (true) {
        const result = await waitSync();
        if (result != -1) {
            console.log("System is fully synced. Exiting loop. " + result);
            starting_height = result;
            break;
        }
        console.log("Retrying sync check in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    return starting_height;
}


async function main() {
    Logger.initialize()
    Logger.log('Loading config file: ' + configFileName)
    try {
        config = JSON.parse(fs.readFileSync(configFileName));
    }
    catch (err) {
        Logger.log('Error: unable to load ' + configFileName);
        Logger.log(err);
        process.exit(1);
    }
    Logger.log(JSON.stringify(config));

    let start_height = 1;
    try {
        start_height = await wait_until_sync();
        console.log("L1 Sync complete " + start_height);
    } catch (error) {
        console.error("Error during L1 synchronization process:", error);
        process.exit(1);
    }

    config.blockchain.start_height = start_height;
    console.log("Starting at height=" + config.blockchain.start_height + " <> " + start_height);


    const jsonString = JSON.stringify(config, null, 4); // Pretty print with 2 spaces

    // Save the JSON string to a file
    fs.writeFile(configFileName, jsonString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      }
      else {
        console.log('Starting height saved to ' + configFileName);
      }
    });

    const network_id = config.blockchain.network_id;
    rpc.setConfig(config);
    bluebird.promisifyAll(rpc);
    mongoClient.init(__dirname, config.mongo.address, config.mongo.port, config.mongo.dbName);
    mongoClient.connect(config.mongo.uri, function (error) {
        if (error) {
            Logger.log('Mongo DB connection failed with err: ', error);
            process.exit();
        }
        else {
            Logger.log('Mongo DB connection succeeded');
            setupGetBlockCronJob(mongoClient, network_id);
        }
    });
}

main();

