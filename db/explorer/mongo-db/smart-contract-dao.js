//------------------------------------------------------------------------------
//  DAO for smartContract
//------------------------------------------------------------------------------

module.exports = class smartContractDAO {

  constructor(execDir, client) {
    this.client = client;
    this.collection = 'smartContract';
  }

  upsertSmartContract(smartContractInfo, callback) {
    console.log('upsert smart contract', smartContractInfo);
    const newObject = {
      'address': smartContractInfo.address,
      'bytecode': smartContractInfo.bytecode,
      'abi': smartContractInfo.abi,
      'source_code': smartContractInfo.source_code,
      'verification_date': smartContractInfo.verification_date,
      'compiler_version': smartContractInfo.compiler_version,
      'optimizer': smartContractInfo.optimizer,
      'name': smartContractInfo.name,
      'function_hash': smartContractInfo.function_hash,
      'constructor_arguments': smartContractInfo.constructor_arguments
    }
    const queryObject = { '_id': smartContractInfo.address };
    this.client.upsert(this.collection, queryObject, newObject, callback);
  }

  getSmartContractByAddress(address, callback) {
    const queryObject = { '_id': address };
    this.client.findOne(this.collection, queryObject, function (error, record) {
      if (error) {
        console.log('Smart Contract dao getSmartContractByAddress ERR - ', error);
        callback(error);
      } else if (!record) {
        callback(Error('NOT_FOUND - SmartContract'));
      } else {
        delete record._id;
        callback(error, record)
      }
    })
  }

  checkSmartContract(address, callback) {
    console.log('check smart contract', address);
    const queryObject = { '_id': address };
    return this.client.exist(this.collection, queryObject, function (err, res) {
      if (err) {
        console.log('error in check SmartContract: ', err);
        callback(err);
      }
      callback(err, res);
    });
  }

  getAbi(address, callback){
    const queryObject = { '_id': address };
    let projectionObject = { abi: 1, _id: 0 };
    this.client.queryWithProjection(this.collection, queryObject, projectionObject, callback);
  }

  getAllInfoListByAccountAndType(page = 0, limit = 0, callback) {
    const sortObject = { timestamp: -1 };
    this.client.getRecords(this.collection, {}, {}, page, limit, callback);
  }
  getAllRecordsNumberByAccountAndType(callback) {
    const aggregateQuery = [
      {
        '$project': {
            // 'holder_count': 1, 
            'address': 1
        }
      }
    ]
    this.client.aggregateQuery(this.collection, aggregateQuery, function (error, recordList) {
      if (error) {
        console.log('ERR - ', error);
        // callback(error);
      } else if (!recordList) {
        callback(Error('NOT_FOUND'));
      } else {
        callback(error, recordList.length)
      }
    })
  }
}