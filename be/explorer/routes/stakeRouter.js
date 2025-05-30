var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var helper = require('../helper/utils');
var BigNumber = require('bignumber.js');

var stakeRouter = (app, stakeDao, accountDao, progressDao) => {
    router.use(bodyParser.urlencoded({ extended: true }));
    router.get("/stake/all", (req, res) => {
        console.log('Querying all stake.');
        let { pageLimit = 0, pageNumber = null } = req.query
        if (pageLimit && pageNumber!= null) {
            pageLimit = parseInt(pageLimit)
            pageNumber = parseInt(pageNumber)
        }
        let totalStakes;

        stakeDao.getTotalNumberAsync().then(total => {
            totalStakes = total
        })
    
        stakeDao.getAllStakesAsync(pageLimit, pageNumber).then(stakeListInfo => {
            let data;
            if (pageLimit && pageNumber!= null) {
                data = ({
                    type: 'stake',
                    body: {
                      content: stakeListInfo,
                      totalrecords: totalStakes,
                      pageNumber,
                      pageLimit,
                      isSuccess: true
                    },
                });
            } else {

              data = ({
                type: 'stake',
                body: stakeListInfo,
              });
            }
            res.status(200).send(data);
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            }
            else {
                console.log('ERR - ', error)
            }
        });
    });

    router.get("/stake/totalAmount", (req, res) => {
        console.log('Querying total staked tokens.');
        progressDao.getStakeProgressAsync().then(info => {
            const data = ({
                type: 'stakeTotalAmout',
                body: { totalAmount: info.total_amount, totalNodes: info.holder_num },
            });
            res.status(200).send(data);
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            } else {
                console.log('ERR - ', error)
            }
        });
    });

    router.get("/stake/totalGcpValue", async (req, res) => { //count total gcp value
        console.log('Querying all gcp value.');
        stakeDao.getGcpValueAsync().then(gcpData => {
            console.log("gcp data", gcpData)
            let data = 0;
            if (Array.isArray(gcpData) && gcpData.length) {
                data = gcpData[0].Total;
            }
            res.status(200).send({ lightningNode: data * 10e-19 });
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            }
            else {
                console.log('ERR - ', error)
            }
        });
    });

    router.get("/stake/totalVcpValue", async (req, res) => { //count total vcp value
        console.log('Querying all gcp value.');
        stakeDao.getVcpValueAsync().then(vcpData => {
            console.log("vcp data", vcpData)
            const data = vcpData[0].Total;
            res.status(200).send({ validatorNode: data * 10e-19 });
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            }
            else {
                console.log('ERR - ', error)
            }
        });
    });

    router.get("/stake/totalHolderAdds", async (req, res) => { //count holder addresses
        console.log('Querying all holder value.');
        stakeDao.getDistinctAsync().then(data => {
            console.log("data", data.length)
            // const data = vcpData[0].Total;
            res.status(200).send({ nodeCount: data.length });
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            }
            else {
                console.log('ERR - ', error)
            }
        });
    });

    router.get("/stake/:id", (req, res) => {
        console.log('Querying stake by address.');
        let { hasBalance = false } = req.query;
        const address = req.params.id.toLowerCase();
        stakeDao.getStakeByAddressAsync(address).then(async stakeListInfo => {
            // TODO: Remove retry after fix the stake issue
            if (stakeListInfo.holderRecords.length === 0 && stakeListInfo.sourceRecords.length === 0) {
                stakeListInfo = await stakeDao.getStakeByAddressAsync(address);
            }
            if (hasBalance === 'true') {
                for (let i = 0; i < stakeListInfo.holderRecords.length; i++) {
                    if (stakeListInfo.holderRecords[i].type === 'gcp') {
                        const accInfo = await accountDao.getAccountByPkAsync(stakeListInfo.holderRecords[i].source);
                        stakeListInfo.holderRecords[i].source_SPAYWei_balance = accInfo.balance.SPAYWei;
                    }
                }
            }
            const data = ({
                type: 'stake',
                body: stakeListInfo,
            });
            res.status(200).send(data);
        }).catch(error => {
            if (error.message.includes('NOT_FOUND')) {
                const err = ({
                    type: 'error_not_found',
                    error
                });
                res.status(404).send(err);
            }
            else {
                console.log('ERR - ', error)
            }
        });
    });

    app.use('/api', router); //the / route of router will get mapped to /api
}

module.exports = stakeRouter;

