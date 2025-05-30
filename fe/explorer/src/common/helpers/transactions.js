import { BigNumber } from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';

import { TxnTypes, TxnTypeText, TxnStatus, WEI } from 'common/constants';
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });


export function totalCoinValue(set, key = 'SPAYWei') {
  //_.forEach(set, v => console.log(_.get(v, `coins.${key}`, 0)))
  return _.reduce(set, (acc, v) => acc + parseInt(_.get(v, `coins.${key}`, 0)), 0)
}

export function from(txn, trunc = null, account = null) {
  let path;
  // if ([TxnTypes.RESERVE_FUND, TxnTypes.SERVICE_PAYMENT].includes(txn.type)) {
  //   path = 'data.source.address';
  // } else 
  if (txn.type === TxnTypes.SPLIT_CONTRACT) {
    path = 'data.initiator.address';
  } else if (txn.type === TxnTypes.COINBASE) {
    path = 'data.proposer.address';
  } else if (txn.type === TxnTypes.DEPOSIT_STAKE || txn.type === TxnTypes.DEPOSIT_STAKE_TX_V2) {
    path = 'data.source.address'
  } else if (txn.type === TxnTypes.WITHDRAW_STAKE) {
    path = 'data.holder.address'
  } else if (txn.type === TxnTypes.SMART_CONTRACT) {
    path = 'data.from.address'
  } else {
    path = 'data.inputs[0].address';
  }
  let addr = _.get(txn, path);
  if (trunc && trunc > 0) {
    addr = _.truncate(addr, { length: trunc });
  }

  return addr;
}

export function to(txn, trunc = null, address = null) {
  let path, isSelf;
  if (txn.type === TxnTypes.SERVICE_PAYMENT) {
    path = 'data.target.address';
  } 
  // else if (txn.type === TxnTypes.RESERVE_FUND) {
  //   return '';
  // } 
  else if (txn.type === TxnTypes.WITHDRAW_STAKE) {
    path = 'data.source.address';
  } else if (txn.type === TxnTypes.DEPOSIT_STAKE || txn.type === TxnTypes.DEPOSIT_STAKE_TX_V2) {
    path = 'data.holder.address';
  } else if (txn.type === TxnTypes.SPLIT_CONTRACT) {
    const splits = _.get(txn, 'data.splits');
    isSelf = splits.some(split => {
      return split.Address === address;
    })
    path = 'data.splits[0].Address';
  } else if (txn.type === TxnTypes.SMART_CONTRACT) {
    path = 'data.to.address'
  } else {
    const outputs = _.get(txn, 'data.outputs');
    isSelf = outputs.some(output => {
      return output.address === address;
    })
    path = 'data.outputs[0].address';
  }
  let addr = isSelf ? address : _.get(txn, path);
  if (trunc && trunc > 0) {
    addr = _.truncate(addr, { length: trunc });
  }
  return addr;
}

export function type(txn) {
  if (txn.status === TxnStatus.PENDING) {
    return status(txn);
  }
  return TxnTypeText[txn.type];
}


export function status(txn) {
  if (!txn.status) {
    return "Finalized";
  }
  return _.capitalize(txn.status);
}



export function fee(txn) {
  let f = _.get(txn, 'data.fee.spaywei');
  f = BigNumber(f).dividedBy(WEI);
  return f.toString();
}

export function gasPrice(txn) {
  let f = _.get(txn, 'data.gas_price');
  f = BigNumber(f).dividedBy(WEI);
  return f.toString();
}

export function value(txn) {
  let values = [
    totalCoinValue(_.get(txn, 'data.inputs'), 'SPAYWei'),
    totalCoinValue(_.get(txn, 'data.inputs'), 'SCPTWei')];
  return _.chain(values)
    .map(v => v ? new BigNumber(v).dividedBy(WEI) : "0")
    .filter(Boolean)
    .map(v => v.toString(10))
    .value();
}

export function hash(txn, trunc = null) {
  let a = _.get(txn, 'hash')
  if (trunc && trunc > 0) {
    a = _.truncate(a, { length: 40 });
  }
  return a;
}

export function age(txn) {
  if (!txn.timestamp || !_.isNumber(parseInt(txn.timestamp)))
    return null;
  return moment(parseInt(txn.timestamp) * 1000).fromNow(true);
}

export function date(txn) {
  if (!txn.timestamp || !_.isNumber(parseInt(txn.timestamp)))
    return null;
  return moment(parseInt(txn.timestamp) * 1000).format("MM/DD/YY hh:mma");
}

export function coins(txn, account = null) {
  let coins = { 'scptwei': 0, 'spaywei': 0 };
  let outputs = null, inputs = null, index = 0;
  switch (txn.type) {
    case TxnTypes.COINBASE:
      outputs = _.get(txn, 'data.outputs');
      if (!account || txn.data.proposer.address === account.address) {
        coins = {
          'scptwei': totalCoinValue(_.get(txn, 'data.outputs'), 'SCPTWei').toFixed(),
          'spaywei': totalCoinValue(_.get(txn, 'data.outputs'), 'SPAYWei').toFixed()
        }
      } else if (outputs.some(output => { return output.address === account.address; })) {
        index = outputs.findIndex(e => e.address === account.address);
        coins = outputs[index].coins;
      }
      break;
    case TxnTypes.TRANSFER:
      outputs = _.get(txn, 'data.outputs');
      inputs = _.get(txn, 'data.inputs')
      if (!account) {
        coins = {
          'SCPTWei': totalCoinValue(_.get(txn, 'data.inputs'), 'SCPTWei').toFixed(),
          'SPAYWei': totalCoinValue(_.get(txn, 'data.inputs'), 'SPAYWei').toFixed()
        }
      } else if (inputs.some(input => { return input.address === account.address; })) {
        index = inputs.findIndex(e => e.address === account.address);
        coins = inputs[index].coins;
      } else if (outputs.some(output => { return output.address === account.address; })) {
        index = outputs.findIndex(e => e.address === account.address);
        coins = outputs[index].coins;
      }
      break
    case TxnTypes.SLASH:
    case TxnTypes.RELEASE_FUND:
    case TxnTypes.SPLIT_CONTRACT:
    case TxnTypes.SMART_CONTRACT:
      break
    case TxnTypes.RESERVE_FUND:
      outputs = _.get(txn, 'data.outputs');
      inputs = _.get(txn, 'data.inputs')
      if (!account) {
        coins = {
          'SCPTWei': totalCoinValue(_.get(txn, 'data.inputs'), 'SCPTWei').toFixed(),
          'SPAYWei': totalCoinValue(_.get(txn, 'data.inputs'), 'SPAYWei').toFixed()
        }
      } else if (inputs.some(input => { return input.address === account.address; })) {
        index = inputs.findIndex(e => e.address === account.address);
        coins = inputs[index].coins;
      } else if (outputs.some(output => { return output.address === account.address; })) {
        index = outputs.findIndex(e => e.address === account.address);
        coins = outputs[index].coins;
      }
      break
    case TxnTypes.SERVICE_PAYMENT:
    case TxnTypes.DEPOSIT_STAKE:
    case TxnTypes.WITHDRAW_STAKE:
    case TxnTypes.DEPOSIT_STAKE_TX_V2:
      coins = txn.data.source.coins;
      break
    default:
      break;
  }
  return coins;
}