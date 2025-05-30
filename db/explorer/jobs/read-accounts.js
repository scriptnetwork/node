var Logger = require('../helper/logger');

let activeActDao = null;
let dailyAccountDao = null;
let totalActDao = null;
let accountDao = null;

exports.Initialize = function (dailyAccountDaoInstance, activeActDaoInstance, totalActDaoInstance, accountDaoInstance) {
  dailyAccountDao = dailyAccountDaoInstance;
  activeActDao = activeActDaoInstance;
  totalActDao = totalActDaoInstance;
  accountDao = accountDaoInstance;
}

exports.Execute = function () {
  let timestamp = (new Date().getTime() / 1000).toFixed();
  dailyAccountDao.getTotalNumberAsync()
    .then(async res => {
      await activeActDao.insertAsync({ amount: res, timestamp });
      // await dailyAccountDao.removeAllAsync();   --- it's for testing
    }).catch(err => {
      Logger.log('error from daily account getTotalNumber:', err);
    })
  accountDao.getTotalNumberAsync()
    .then(async res => {
      await totalActDao.insertAsync({ amount: res, timestamp });
    }).catch(err => {
      Logger.log('error from account getTotalNumber:', err);
    })
}