var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var helper = require("../helper/utils");

var transactionRouter = (app, transactionDao, progressDao, txHistoryDao, config) => {
    router.use(bodyParser.urlencoded({ extended: true }));

    router.get("/transaction/:hash", (req, res) => {
        let hash = helper.normalize(req.params.hash.toLowerCase());
        console.log("Querying one transaction by using uuid: " + hash);
        progressDao.getProgressAsync(config.blockchain.network_id).then((progressInfo) => {
            latest_transaction_count = progressInfo.count;
            return transactionDao.getTransactionByPkAsync(hash);
        }).then((transactionInfo) => {
            var data = {
            type: "transaction",
            body: transactionInfo,
            totalTxsNumber: latest_transaction_count,
            };
            res.status(200).send(data);
        }).catch((error) => {
            if (error.message.includes("NOT_FOUND")) {
                const err = {
                type: "error_not_found",
                error,
            };
            res.status(404).send(err);
            }
            else {
                console.log("ERR - ", error);
            }
        });
    });

    router.get("/transactions/range", (req, res) => {
        let totalPageNumber = 0;
        let { pageNumber = 1, limit = 10 } = req.query;
        progressDao.getProgressAsync(config.blockchain.network_id).then((progressInfo) => {
            totalNumber = progressInfo.count;
            let diff = null;
            pageNumber = parseInt(pageNumber);
            limit = parseInt(limit);
            totalPageNumber = 1 + Math.ceil(totalNumber / limit);
            let searchPage = pageNumber;
            if (!isNaN(pageNumber) &&!isNaN(limit) && pageNumber > 0 && pageNumber <= totalPageNumber && limit > 0 && limit < 101) {
                if (pageNumber > totalPageNumber / 2) {
                    diff = limit;
                    searchPage = totalPageNumber - pageNumber + 1;
                }
                return transactionDao.getTransactionsAsync(searchPage - 1, limit, diff);
            }
            else {
                res.status(400).send("Wrong parameter.");
            }
        }).then((transactionInfoList) => {
            var data = {
                type: "transaction_list",
                body: transactionInfoList,
                totalPageNumber,
                currentPageNumber: pageNumber,
            };
            res.status(200).send(data);
        });
    });

    router.get("/transactions/number", (req, res) => {
        transactionDao.getTotalNumberByHourAsync(null).then((number) => {
            var data = {
                type: "transaction_number",
                body: { total_num_tx: number },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    router.get("/transactions/number/:h", (req, res) => {
        const { h } = req.params;
        const hour = Number.parseInt(h);
        if (hour > 720) {
            res.status(400).send("Wrong parameter.");
            return;
        }
        transactionDao.getTotalNumberByHourAsync(hour).then((number) => {
            var data = {
                type: "transaction_number_by_hour",
                body: { total_num_tx: number },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    router.get("/transactions/list/:h", (req, res) => {
        const { h } = req.params;
        const hour = Number.parseInt(h);
        if (hour > 720) {
            res.status(400).send("Wrong parameter.");
            return;
        }
        transactionDao.getTotalListByHourAsync(hour).then((records) => {
            var data = {
                type: "transaction_records_by_hour",
                body: { records },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    router.get("/transactions/history", (req, res) => {
        txHistoryDao.getAllTxHistoryAsync().then((infoList) => {
            var data = {
                type: "transaction_number_by_hour",
                body: { data: infoList },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    router.get("/transactions/historyByHr", (req, res) => {
        txHistoryDao.getAllTxHistoryByHrAsync().then((infoList) => {
            var data = {
                type: "transaction_history_by_hour",
                body: { data: infoList },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    router.get("/transactions/historyByFilter", (req, res) => {
        let filterOption = req.query.filterBy;
        if (!filterOption) {
            throw "filter not valid";
        }
        txHistoryDao.getAllTxHistoryByFilterAsync(filterOption).then((infoList) => {
            var data = {
                type: "transaction_history_by_hour",
                body: { data: infoList },
            };
            res.status(200).send(data);
        }).catch((err) => {
            console.log("Error - Push total number of transaction", err);
        });
    });

    app.use("/api", router); //the / route of router will get mapped to /api
};

module.exports = transactionRouter;

