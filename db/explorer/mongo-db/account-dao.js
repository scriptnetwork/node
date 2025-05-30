
//------------------------------------------------------------------------------
//  DAO for account
//  Require index: `db.account.createIndex({"balance.scptwei": -1})`
//  Require index: `db.account.createIndex({"balance.SPAYWei": -1})`
//------------------------------------------------------------------------------

module.exports = class AccountDAO {

  constructor(execDir, client) {
    this.client = client;
    this.accountInfoCollection = 'account';
  }

  upsertAccount(accountInfo, callback) {
    // console.log('accountInfo in upsert:', accountInfo)
    const newObject = {
      'address': accountInfo.address,
      'balance': accountInfo.balance,
      'sequence': accountInfo.sequence,
      'reserved_funds': accountInfo.reserved_funds === null ? 'null' : accountInfo.reserved_funds,
      // 'lst_updt_blk': accountInfo.last_updated_block_height,
      'txs_counter': accountInfo.txs_counter,
      'code': accountInfo.code
    }
    const queryObject = { '_id': newObject.address };
    this.client.upsert(this.accountInfoCollection, queryObject, newObject, callback);
  }
  checkAccount(address, callback) {
    const queryObject = { '_id': address };
    return this.client.exist(this.accountInfoCollection, queryObject, function (err, res) {
      if (err) {
        console.log('error in checkAccount: ', err);
        callback(err);
      }
      callback(err, res);
    });
  }
  getTotalNumber(callback) {
    this.client.getTotal(this.accountInfoCollection, null, function (error, record) {
      if (error) {
        console.log('ERR - ', error);
      } else {
        callback(error, record);
      }
    });
  }
  getTopAccounts(tokenType, limitNumber, callback) {
    const key = "balance." + tokenType;
    const queryObject = { [key]: -1 };
    this.client.getTopRecords(this.accountInfoCollection, queryObject, limitNumber, function (error, recordList) {
      var accountInfoList = []
      for (var i = 0; i < recordList.length; i++) {
        var accountInfo = {};
        accountInfo.address = recordList[i].address;
        accountInfo.balance = recordList[i].balance;
        accountInfo.sequence = recordList[i].sequence;
        accountInfo.reserved_funds = recordList[i].reserved_funds;
        accountInfo.txs_counter = recordList[i].txs_counter;
        accountInfoList.push(accountInfo)
      }
      callback(error, accountInfoList)
    })
  }
  getAccountByPk(address, callback) {
    const queryObject = { '_id': address };
    this.client.findOne(this.accountInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log('ERR - ', error, address);
        // callback(error);
      } else if (!record) {
        callback(Error('NOT_FOUND - ' + address));
      } else {
        // console.log('account info in record: ', record)
        var accountInfo = {};
        accountInfo.address = record.address;
        accountInfo.balance = record.balance;
        accountInfo.sequence = record.sequence;
        accountInfo.reserved_funds = record.reserved_funds;
        accountInfo.txs_counter = record.txs_counter;
        callback(error, accountInfo);
      }
    })
  }

  // getTotalScptWeiAccountBalance(callback) {
  //   // const queryObject = { 'type': { $in: types } };
  //   const queryObject = [{
  //     $match: {
  //       address: { $nin: [ "0x55aab217f5e0c9e11099c530b55feb150f2f757a"] }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: "null",
  //       Total: {
  //         $sum: {
  //           "$toDouble": "$balance.scptwei"
  //         }
  //       }
  //     }
  //   }];

  //   this.client.aggregateQuery(this.accountInfoCollection, queryObject, function (error, recordList) {
  //     if (error) {
  //       console.log('ERR - ', error);
  //       // callback(error);
  //     } else if (!recordList) {
  //       callback(Error('NOT_FOUND - All Stakes'));
  //     } else {
  //       callback(error, recordList)
  //     }
  //   })
  // }

  getTotalScptWeiAccountBalance(callback) {
    // const queryObject = { 'type': { $in: types } };
    const queryObject = [{
      $group: {
        _id: "null",
        Total: {
          $sum: {
            "$toDouble": "$balance.scptwei"
          }
        }
      }
    }];

    this.client.aggregateQuery(this.accountInfoCollection, queryObject, function (error, recordList) {
      if (error) {
        console.log('ERR - ', error);
        // callback(error);
      } else if (!recordList) {
        callback(Error('NOT_FOUND - All Stakes'));
      } else {
        callback(error, recordList)
      }
    })
  }

  getTotalSpayWeiAccountBalance(callback) {
    // const queryObject = { 'type': { $in: types } };
    const queryObject = [{
      $group: {
        _id: "null",
        Total: {
          $sum: {
            "$toDouble": "$balance.spaywei"
          }
        }
      }
    }];

    this.client.aggregateQuery(this.accountInfoCollection, queryObject, function (error, recordList) {
      if (error) {
        console.log('ERR - ', error);
        // callback(error);
      } else if (!recordList) {
        callback(Error('NOT_FOUND - All Stakes'));
      } else {
        callback(error, recordList)
      }
    })
  }

  getTotalAccountBalance(callback) {
    // const queryObject = { 'type': { $in: types } };
    
    const queryObject = [
      {
        '$match': {
          'address': {
            '$nin': [
              '0x55aab217f5e0c9e11099c530b55feb150f2f757a'
            ]
          }
        }
      }, {
        '$addFields': {
          'scptwei': {
            '$toDouble': '$balance.scptwei'
          }, 
          'spaywei': {
            '$toDouble': '$balance.spaywei'
          }
        }
      }, {
        '$addFields': {
          'scptwei': {
            '$divide': [
              '$scptwei', 1000000000000000000
            ]
          }, 
          'spaywei': {
            '$divide': [
              '$spaywei', 1000000000000000000
            ]
          }
        }
      }, {
        '$group': {
          '_id': null, 
          'scptwei': {
            '$sum': '$scptwei'
          }, 
          'spaywei': {
            '$sum': '$spaywei'
          }
        }
      }
    ];

    this.client.aggregateQuery(this.accountInfoCollection, queryObject, function (error, recordList) {
      if (error) {
        console.log('ERR - ', error);
        // callback(error);
      } else if (!recordList) {
        callback(Error('NOT_FOUND - All Stakes'));
      } else {
        callback(error, recordList)
      }
    })
  }
}