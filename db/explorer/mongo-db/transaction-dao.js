//------------------------------------------------------------------------------
//  DAO for transaction
//  Require index: `db.transaction.createIndex({number:1})`
//  Require index: `db.transaction.createIndex({status:1})`
//  Require index: `db.transaction.createIndex({timestamp:-1})`
//  Require index: `db.transaction.createIndex({number:1,status:1})`
//  Require index: `db.transaction.createIndex({number:-1,status:1})`
//------------------------------------------------------------------------------

module.exports = class TransactionDAO {

  constructor(execDir, client) {
    this.client = client;
    this.transactionInfoCollection = 'transaction';
  }

  upsertTransaction(transactionInfo, callback) {
    const newObject = {
      'hash': transactionInfo.hash,
      'eth_tx_hash': transactionInfo.eth_tx_hash,
      'type': transactionInfo.type,
      'data': transactionInfo.data,
      'number': transactionInfo.number,
      'block_height': transactionInfo.block_height,
      'timestamp': transactionInfo.timestamp,
      'receipt': transactionInfo.receipt,
      'status': transactionInfo.status
    }
    const queryObject = { '_id': newObject.hash };
    this.client.upsert(this.transactionInfoCollection, queryObject, newObject, callback);
  }
  checkTransaction(hash, callback) {
    const queryObject = { '_id': hash };
    this.client.exist(this.transactionInfoCollection, queryObject, function (err, res) {
      if (err) {
        console.log('error in checkTransaction: ', err);
        callback(err);
      }
      // console.log('result in check transaction: ', res);
      callback(err, res);
    });
  }
  getTransactions(pageNumber, limitNumber, diff, callback) {
    const queryObject = { 'status': 'finalized' };
    const sortObject = { 'number': diff === null ? -1 : 1 };
    pageNumber = pageNumber;
    limitNumber = limitNumber;
    this.client.getRecords(this.transactionInfoCollection, queryObject, sortObject, pageNumber, limitNumber, callback);
  }
  getTransactionByPk(pk, callback) {
    // console.log("this---->>>>111111111", this)

    let dummy = "dummy";
    if (dummy !== "dummy") {
   
      query(undefined, this.client);


    } else {
      query(undefined, this.client);
    }

    function query(type, client) {

      // let type = undefined
      // const queryObject = { '_id': pk };
      const queryObject = type == undefined ? { '_id': pk } : { 'eth_tx_hash': pk };
      // console.log("this---->>>>", client)
      client.findOne('transaction', queryObject, function (error, record) {
        if (error) {
          console.log('ERR - ', error, pk);
          // callback(error);
        } else if (!record) {
          if (type == undefined && pk !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            query('eth_hash', client);
            return;
          }
          callback(Error('NOT_FOUND - ' + pk));
        } else {
          var transactionInfo = {};
          transactionInfo.hash = record.hash;
          transactionInfo.eth_tx_hash = record.eth_tx_hash;
          transactionInfo.type = record.type;
          transactionInfo.data = record.data;
          transactionInfo.number = record.number;
          transactionInfo.block_height = record.block_height;
          transactionInfo.timestamp = record.timestamp;
          transactionInfo.status = record.status;
          transactionInfo.receipt = record.receipt;
          callback(error, transactionInfo);
        }
      })
    }
  }
  getTotalNumberByHour(hour, callback) {
    let queryObject = null;
    if (hour !== null) {
      const now = Math.floor(new Date().getTime() / 1000);
      const startTime = now - hour * 60 * 60;
      queryObject = { timestamp: { $gte: startTime.toString(), $lte: now.toString() } }
    }
    this.client.getTotal(this.transactionInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log('ERR - ', error);
      } else {
        console.log('Calling get total number of txs, returns:', record)
        callback(error, record);
      }
    });
  }
  getTotalListByHour(hour, callback) {
    let queryObject = {
      type: {$nin: [0]}
    };
    if (hour !== null) {
      const now = Math.floor(new Date().getTime() / 1000);
      const startTime = now - hour * 60 * 60;
      queryObject.timestamp = { $gte: startTime.toString(), $lte: now.toString() };
    }
    this.client.getRecords(this.transactionInfoCollection, queryObject, {}, 0, 0, function (error, record) {
      if (error) {
        console.log('ERR - ', error);
      } else {
        console.log('Calling get total number of txs, returns:', record)
        callback(error, record);
      }
    });
  }
  getTransactionsByPk(pks, callback) {
    const queryObject = { _id: { $in: pks } };
    this.client.getRecords(this.transactionInfoCollection, queryObject, {}, 0, 0, function (error, transactions) {
      if (error) {
        console.log('ERR - ', error, pks);
      } else if (!transactions) {
        callback(Error('NOT_FOUND - ' + pks));
      } else {
        callback(error, transactions);
      }
    })
  }

  getDailyActiveWallets(callback) {

    const now = Math.floor(new Date().getTime() / 1000);
    const startTime = now - 24 * 60 * 60;
    let queryObject = [
      {
        '$match': {
          'timestamp': {
            '$gte': startTime.toString(),
            '$lte': now.toString()
          },
          'type': {
            '$ne': 0
          }
        }
      }]
      ;
    console.log("query obj", queryObject)

    this.client.aggregateQuery(this.transactionInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log('ERR - ', error);
      } else {
        // console.log('Calling get total number of txs, returns:', record)
        callback(error, record);
      }
    });
  }
}