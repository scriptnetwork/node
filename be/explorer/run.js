var fs = require("fs");
var express = require("express");
var app = express();
var bluebird = require("bluebird");
var rpc = require("api/rpc.js");
var mongoClient = require("mongo-db/mongo-client.js");
var blockDaoLib = require("mongo-db/block-dao.js");
var progressDaoLib = require("mongo-db/progress-dao.js");
var transactionDaoLib = require("mongo-db/transaction-dao.js");
var accountDaoLib = require("mongo-db/account-dao.js");
var accountTxDaoLib = require("mongo-db/account-tx-dao.js");
var accountTxSendDaoLib = require("mongo-db/account-tx-send-dao.js");
var stakeDaoLib = require("mongo-db/stake-dao.js");
var priceDaoLib = require("mongo-db/price-dao.js");
var txHistoryDaoLib = require("mongo-db/tx-history-dao.js");
var accountingDaoLib = require("mongo-db/accounting-dao.js");
var checkpointDaoLib = require("mongo-db/checkpoint-dao.js");
var smartContractDaoLib = require("mongo-db/smart-contract-dao.js");
var activeAccountDaoLib = require("mongo-db/active-account-dao.js");
var tokenDaoLib = require("mongo-db/token-dao.js");
var tokenSummaryDaoLib = require("mongo-db/token-summary-dao.js");
var tokenHolderDaoLib = require("mongo-db/token-holder-dao.js");
var blocksRouter = require("./routes/blocksRouter");
var transactionsRouter = require("./routes/transactionsRouter");
var accountRouter = require("./routes/accountRouter");
var accountTxRouter = require("./routes/accountTxRouter");
var stakeRouter = require("./routes/stakeRouter");
var priceRouter = require("./routes/priceRouter");
var accountingRouter = require("./routes/accountingRouter");
var smartContractRouter = require("./routes/smartContractRouter");
var activeActRouter = require("./routes/activeActRouter");
var tokenRouter = require("./routes/tokenRouter");
var supplyRouter = require("./routes/supplyRouter");
var cors = require("cors");
var io;
var config = null;
var configFileName = 'config.cfg';
var blockDao = null;
var isPushingData = false;

main();

function main() {
    console.log("Loading config file: " + configFileName);
    try {
        const configBuffer = fs.readFileSync(configFileName);
        config = JSON.parse(configBuffer);
    }
    catch (err) {
        console.log("Error: unable to load " + configFileName);
        console.log(err);
        process.exit(1);
    }
    console.log(config);
    rpc.setConfig(config);
    bluebird.promisifyAll(rpc);
    mongoClient.init(
        __dirname,
        config.mongo.address,
        config.mongo.port,
        config.mongo.dbName
    );
    mongoClient.connect(config.mongo.uri, function (err) {
        if (err) {
            console.log("Mongo connection failed");
            process.exit(1);
        }
        else {
            console.log("Mongo connection succeeded");
            blockDao = new blockDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(blockDao);
            progressDao = new progressDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(progressDao);
            transactionDao = new transactionDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(transactionDao);
            accountDao = new accountDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(accountDao);
            accountTxDao = new accountTxDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(accountTxDao);
            activeActDao = new activeAccountDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(activeActDao);
            accountTxSendDao = new accountTxSendDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(accountTxSendDao);
            stakeDao = new stakeDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(stakeDao);
            priceDao = new priceDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(priceDao);
            txHistoryDao = new txHistoryDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(txHistoryDao);
            accountingDao = new accountingDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(accountingDao);
            checkpointDao = new checkpointDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(checkpointDao);
            smartContractDao = new smartContractDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(smartContractDao);
            tokenDao = new tokenDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(tokenDao);
            tokenSummaryDao = new tokenSummaryDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(tokenSummaryDao);
            tokenHolderDao = new tokenHolderDaoLib(__dirname, mongoClient);
            bluebird.promisifyAll(tokenHolderDao);
            var privateKey = ""; //fs.readFileSync(config.cert.key, 'utf8');
            var certificate = ""; //fs.readFileSync(config.cert.crt, 'utf8');
            var options = {
                key: privateKey,
                cert: certificate,
            };
            app.get("/ping", function (req, res) {
                console.log("Receive healthcheck /ping from ELB - " + req.connection.remoteAddress);
                res.writeHead(200, {
                    "Content-Type": "text/plain",
                    "Content-Length": 2,
                });
                res.write("OK");
                res.end();
            });
            var server = require("http").createServer(options, app);
            io = require("socket.io")(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                    allowedHeaders: ["*"],
                    credentials: true,
                },
            });
            io.on("connection", onClientConnect);
            server.listen(config.server.port);
            app.use(cors());
            // app.use(bodyParser.json());
            // app.use(bodyParser.urlencoded({ extended: true }));
            // var https = require('http').createServer(options, app);
            // https.listen(config.server.port, () => {
            //   console.log("rest api running on port.", 9000);
            // });
            var http = require("http").createServer(app);
            http.listen(config.rest_api.port, () => {
                console.log("rest api running on port.", config.rest_api.port);
            });
            // REST services
            blocksRouter(app, blockDao, progressDao, checkpointDao, config);
            transactionsRouter(
                app,
                transactionDao,
                progressDao,
                txHistoryDao,
                config
            );
            accountRouter(app, accountDao, tokenDao, rpc, config);
            accountTxRouter(
                app,
                accountDao,
                accountTxDao,
                accountTxSendDao,
                transactionDao,
                rpc,
                config
            );
            stakeRouter(app, stakeDao, accountDao, progressDao, config);
            supplyRouter(app, config);
            priceRouter(app, priceDao, config);
            accountingRouter(app, accountingDao);
            smartContractRouter(
                app,
                smartContractDao,
                transactionDao,
                accountTxDao,
                tokenDao,
                tokenSummaryDao,
                tokenHolderDao
            );
            activeActRouter(app, activeActDao);
            tokenRouter(app, tokenDao, tokenSummaryDao, tokenHolderDao);
        }
    });
}

function onClientConnect(client) {
    //console.log("client connected.");
    isPushingData = true;
    pushTopBlocks();
    pushTopTransactions();
    pushTotalTxsNum();
    //client.on("disconnect", onClientDisconnect);
}

function pushTopBlocks() {
    const numberOfBlocks = 5;
    progressDao
        .getProgressAsync(config.blockchain.network_id)
        .then(function (progressInfo) {
            latest_block_height = progressInfo.height;
            // console.log('Latest block height: ' + latest_block_height.toString());
            var query_block_height_max = latest_block_height;
            var query_block_height_min = Math.max(
                0,
                query_block_height_max - numberOfBlocks + 1
            ); // pushing 50 blocks initially
            console.log("Querying blocks from " + query_block_height_min.toString() + " to " + query_block_height_max.toString());
            //return blockDao.getBlockAsync(123)
            return blockDao.getBlocksByRangeAsync(query_block_height_min, query_block_height_max);
        })
        .then(function (blockInfoList) {
            io.sockets.emit("PUSH_TOP_BLOCKS", {
                type: "block_list",
                body: blockInfoList,
              });
        });
    if (isPushingData) setTimeout(pushTopBlocks, 1000);
}

function pushTopTransactions() {
    const numberOfTransactions = 5;
    transactionDao
        .getTransactionsAsync(0, numberOfTransactions, null)
        .then(function (transactionInfoList) {
            io.sockets.emit("PUSH_TOP_TXS", {
            type: "transaction_list",
            body: transactionInfoList,
        });
    });
    if (isPushingData) setTimeout(pushTopTransactions, 1000);
}

function pushTotalTxsNum() {
    transactionDao
        .getTotalNumberByHourAsync(null)
        .then((number) => {
            io.sockets.emit("PUSH_TOTAL_NUM_TXS", {
                type: "total_number_transaction",
                body: { total_num_tx: number },
            });
        })
        .catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    if (isPushingData) setTimeout(pushTotalTxsNum, 1000);
}

function onClientDisconnect() {
    isPushingData = false;
    //console.log("client disconnect");
}

