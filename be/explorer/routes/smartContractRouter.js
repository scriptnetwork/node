var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var helper = require('../helper/utils');
var axios = require("axios").default;
var { updateTokenHistoryBySmartContract } = require('../helper/smart-contract');

var smartContractRouter = (app, smartContractDao, transactionDao, accountTxDao, tokenDao, tokenSummaryDao, tokenHolderDao) => {
  router.use(bodyParser.json({ limit: '1mb' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  // The api to verify the source and bytecode
  router.post("/smartContract/verify/:address", async (req, res) => {
    let address = helper.normalize(req.params.address.toLowerCase());
    let { sourceCode, abi, version, optimizer, versionFullName, optimizerRuns = 200, isSingleFile = true, libs = {} } = req.body;
    console.log('isSingleFile:', isSingleFile, typeof isSingleFile)
    optimizerRuns = +optimizerRuns;
    if (Number.isNaN(optimizerRuns)) optimizerRuns = 200;
    console.log('Verifying source code for address', address);
    console.log('Verifying source code for address explorer api', address);
    try {
      let sc = await smartContractDao.getSmartContractByAddressAsync(address)
      let byteCode = sc.bytecode;
      let libsSourceCode = {}
      for (let lib in libs) {
        const libAdr = helper.normalize(libs[lib].toLowerCase());
        console.log('lib:', lib, libAdr)

        if (!helper.validateHex(libAdr, 40)) {
          res.status(200).send({ err_msg: `Invalid library address: ${libAdr}.` })
          return;
        }
        let libsc;
        try {
          libsc = await smartContractDao.getSmartContractByAddressAsync(libAdr);
        } catch (e) {
          if (e.message.includes('NOT_FOUND')) {
            res.status(200).send({ err_msg: `No contract library found on address: ${libAdr}.` })
            return;
          }
        }
        if (!libsc.source_code) {
          res.status(200).send({ err_msg: `Library contract ${libAdr}} haven't been verified, please verify the library contract first.` })
          return;
        }
        libsSourceCode[libAdr] = libsc.source_code;
      }
      console.log('libsSourceCode:', libsSourceCode)
      let result = await axios.post(`http://localhost:9090/api/verify/${address}`, {
        byteCode, sourceCode, abi, version, optimizer, versionFullName, optimizerRuns, isSingleFile, libs, libsSourceCode
      })
      console.log('Received response from verification server.', result.data.result);
      if (result.data.result.verified === true) {
        let newSc = { ...result.data.smart_contract, bytecode: byteCode }
        await smartContractDao.upsertSmartContractAsync(newSc);
        updateTokenHistoryBySmartContract(newSc, transactionDao, accountTxDao, tokenDao, tokenSummaryDao, tokenHolderDao);

      }
      const data = {
        result: result.data.result,
        err_msg: result.data.err_msg,
        warning_msg: result.data.warning_msg
      }
      res.status(200).send(data)
    } catch (e) {
      if (e.response) {
        console.log('Error in catch:', e.response.status)
        res.status(400).send(e.response.status)
      } else {
        res.status(400).send(e)
      }
    }
  });
  // The api to only get smart contract api by address
  router.get("/smartContract/abi/:address", (req, res) => {
    let address = helper.normalize(req.params.address.toLowerCase());
    console.log('Querying smart contract abi for address:', address);
    smartContractDao.getAbiAsync(address)
      .then(info => {
        const data = ({
          type: 'smart_contract_abi',
          body: info[0],
        });
        res.status(200).send(data);
      })
      .catch(error => {
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

  // The api to smart contract info by address
  router.get("/smartContract/:address", (req, res) => {
    let address = helper.normalize(req.params.address.toLowerCase());
    console.log('Querying smart contract data for address:', address);
    smartContractDao.getSmartContractByAddressAsync(address)
      .then(info => {
        const data = ({
          type: 'smart_contract',
          body: info,
        });
        res.status(200).send(data);
      })
      .catch(error => {
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

  router.get("/smartContract/tokenTx/all", (req, res) => {
    let totalPageNumber = 0;
    let { pageNumber = 1, limit = 10 } = req.query;
    smartContractDao.getAllRecordsNumberByAccountAndTypeAsync()
      .then(totalNumber => {
        if (totalNumber === 0) {
          res.status(400).send('No Related Record.');
          return;
        }
        pageNumber = parseInt(pageNumber);
        limit = parseInt(limit);
        totalPageNumber = Math.ceil(totalNumber / limit);
        if (!isNaN(pageNumber) && !isNaN(limit) && pageNumber > 0 && pageNumber <= totalPageNumber && limit > 0 && limit < 101) {
          return smartContractDao.getAllInfoListByAccountAndTypeAsync(pageNumber - 1, limit)
        } else {
          res.status(400).send('Wrong parameter.');
          return;
        }
      })
      .then(info => {
        if (!info) return;
        const data = ({
          "type": "token_txs",
          body: info,
          totalPageNumber,
          currentPageNumber: pageNumber
        })
        res.status(200).send(data);
      })
  });

  //the / route of router will get mapped to /api
  app.use('/api', router);
}

module.exports = smartContractRouter;