import React, { Component } from "react";
import { Link } from 'react-router';
import cx from 'classnames';
import { BigNumber } from 'bignumber.js';

import { TxnTypes, TxnTypeText, TxnClasses, TxnPurpose, zeroTxAddress } from 'common/constants';
import { date, age, fee, status, type, gasPrice } from 'common/helpers/transactions';
import { formatCoin, priceCoin, getHex } from 'common/helpers/utils';
import { priceService } from 'common/services/price';
import { transactionsService } from 'common/services/transaction';
import NotExist from 'common/components/not-exist';
import DetailsRow from 'common/components/details-row';
import JsonView from 'common/components/json-view';
import BodyTag from 'common/components/body-tag';
import { withTranslation } from "react-i18next";


class TransactionExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      transaction: null,
      totalTransactionsNumber: undefined,
      errorType: null,
      showRaw: false,
      price: { 'SCPT': 0, 'SPAY': 0 }
    };
  }
  componentWillUpdate(nextProps) {
    if (nextProps.params.transactionHash !== this.props.params.transactionHash) {
      this.getOneTransactionByUuid(nextProps.params.transactionHash);
      // this.getPrices();
    }
  }
  componentDidMount() {
    const { transactionHash } = this.props.params;
    this.getOneTransactionByUuid(transactionHash.toLowerCase());
    // this.getPrices();
  }
  getPrices() {
    priceService.getAllprices()
      .then(res => {
        const prices = _.get(res, 'data.body');
        prices.forEach(info => {
          switch (info._id) {
            case 'SCPT':
              this.setState({ price: { ...this.state.price, 'SCPT': info.price } })
              return;
            case 'SPAY':
              this.setState({ price: { ...this.state.price, 'SPAY': info.price } })
              return;
            default:
              return;
          }
        })
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      let { price } = this.state;
      if (!price.SCPT || !price.SPAY) {
        this.getPrices();
      }
    }, 1000);
  }
  getOneTransactionByUuid(hash) {
    if (hash) {
      transactionsService.getOneTransactionByUuid(hash.toLowerCase())
        .then(res => {
          switch (res.data.type) {
            case 'transaction':
              this.setState({
                transaction: res.data.body,
                totalTransactionsNumber: res.data.totalTxsNumber,
                errorType: null
              })
              break;
            case 'error_not_found':
              this.setState({
                errorType: 'error_not_found'
              });
          }
        }).catch(err => {
          console.log(err);
        })
    } else {
      this.setState({
        errorType: 'error_not_found'
      });
      console.log('Wrong Height')
    }
  }
  handleToggleDetailsClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showRaw: !this.state.showRaw });
  }
  render() {
    const {t} = this.props;
    const { transactionHash } = this.props.params;
    const { transaction, errorType, showRaw, price } = this.state;
    return (
      <div className="content transaction-details">
        <div className="page-title transactions">{t(`transaction_detail`)}</div>
        <BodyTag className={cx({ 'show-modal': showRaw })} />
        {errorType &&
          <NotExist />}
        {transaction && errorType === null &&
          <React.Fragment>
            <table className="details txn-info">
              <thead>
                <tr>
                  <th># {t(`hash`)}</th>
                  <th>{transaction.hash}</th>
                </tr>
              </thead>
              <tbody>
                {transaction.eth_tx_hash !== zeroTxAddress && transaction.eth_tx_hash != null && <tr>
                  <th>{t(`eth_hash`)}</th>
                  <td style={{ borderBottom: '1px solid #dee2e6', color: 'white' }}><Link to={`/txs/${transaction.eth_tx_hash}`}>{transaction.eth_tx_hash}</Link></td>
                </tr>}
                <tr>
                  <th>{t('type')}</th>
                  <td>{type(transaction)}</td>
                </tr>
                <tr>
                  <th>{t(`type`)}</th>
                  <td>{status(transaction)}</td>
                </tr>
                <tr>
                  <th>{t(`block`)}</th>
                  <td><Link to={`/blocks/${transaction.block_height}`}>{transaction.block_height}</Link></td>
                </tr>
                <tr>
                  <th>{t(`time`)}</th>
                  <td title={age(transaction)}>{date(transaction)}</td>
                </tr>
              </tbody>
            </table>

            <div className="details-header">
              <div className={cx("txn-type", TxnClasses[transaction.type])}>{type(transaction)}</div>
              <button className="btn tx raw" onClick={this.handleToggleDetailsClick}>{t(`view_raw_txn`)}</button>
            </div>
            {transaction.type === TxnTypes.COINBASE &&
              <Coinbase transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.SLASH &&
              <Slash transaction={transaction} t={t} />}

            {transaction.type === TxnTypes.TRANSFER &&
              <Send transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.RESERVE_FUND &&
              <ReserveFund transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.RELEASE_FUND &&
              <ReleaseFund transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.SERVICE_PAYMENT &&
              <ServicePayment transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.SPLIT_CONTRACT &&
              <SplitContract transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.SMART_CONTRACT &&
              <SmartContract transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.WITHDRAW_STAKE &&
              <WithdrawStake transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.DEPOSIT_STAKE &&
              <DepositStake transaction={transaction} price={price} t={t} />}

            {transaction.type === TxnTypes.DEPOSIT_STAKE_TX_V2 &&
              <DepositStake transaction={transaction} price={price} t={t} />}

            {showRaw &&
              <JsonView
                json={transaction}
                onClose={this.handleToggleDetailsClick}
                className="tx-raw" />}
          </React.Fragment>}
      </div>);
  }
}


function _getAddressShortHash(address) {
  return address.substring(12) + '...';
}

function _renderIds(ids) {
  return _.map(ids, i => <div key={i}>{i}</div>)
}


const Amount = ({ coins, price }) => {
  return (
    <React.Fragment>
      <div className="currency scpt">
        {formatCoin(coins.scptwei)} SCPT
        {/* <div className='price'>{`[\$${priceCoin(coins.scptwei, price['Pando'])} USD]`}</div>
        <div></div> */}
      </div>
      <div className="currency spay">
        {formatCoin(coins.spaywei)} SPAY
        {/* <div className='price'>{`[\$${priceCoin(coins.SPAYWei, price['SPAY'])} USD]`}</div> */}
      </div>
    </React.Fragment>)
}

const Address = ({ hash, truncate = null }) => {
  return (<Link to={`/account/${hash}`}>{truncate ? _.truncate(hash, { length: truncate }) : hash}</Link>)
}

const Fee = ({ transaction, t }) => {
  return (<span className="currency spay">{fee(transaction) + " SPAY"}</span>);
}

const CoinbaseOutput = ({ output, price, t }) => {
  const isPhone = window.screen.width <= 560;
  const isSmallPhone = window.screen.width <= 320;
  const truncate = isPhone ? isSmallPhone ? 10 : 15 : null;
  return (
    <div className="coinbase-output">
      <div>
        <Amount coins={output.coins} price={price} />
      </div>
      <Address hash={output.address} truncate={truncate} />
    </div>);
}

const ServicePayment = ({ transaction, price, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        <DetailsRow label={t(`from_address`)} data={<Address hash={data.source.address} />} />
        <DetailsRow label={t(`to_address`)} data={<Address hash={data.target.address} />} />
        <DetailsRow label={t(`amount`)} data={<Amount coins={data.source.coins} price={price} />} />
        <DetailsRow label={t(`payment_sequence`)} data={data.payment_sequence} />
        <DetailsRow label={t(`reserve_sequence`)} data={data.reserve_sequence} />
        <DetailsRow label={t(`resource_id`)} data={data.resource_id} />
      </tbody>
    </table>);
}

const ReserveFund = ({ transaction, price, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        <DetailsRow label={t(`collateral`)} data={<Amount coins={data.collateral} price={price} />} />
        <DetailsRow label={t(`duration`)} data={data.duration} />
        <DetailsRow label={t(`amount`)} data={<Amount coins={data.source.coins} price={price} />} />
        <DetailsRow label={t(`source_address`)} data={<Address hash={data.source.address} />} />
        <DetailsRow label={t(`resource_ids`)} data={_renderIds(data.resource_ids)} />
      </tbody>
    </table>);
}

const ReleaseFund = ({ transaction }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>

      </tbody>
    </table>);
}

const SplitContract = ({ transaction, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        <DetailsRow label={t('duration')} data={data.duration} />
        <DetailsRow label={t(`initiator_address`)} data={<Address hash={data.initiator.address} />} />
        <DetailsRow label={t(`resource_id`)} data={data.resource_id} />
        <DetailsRow label={t(`splits`)} data={
          (<div className="th-tx-text__split">
            {data.splits.map(split => <span key={split.Address}>{'Address: ' + split.Address + '  ' + split.Percentage + '%'}</span>)}
          </div>)} />
      </tbody>
    </table>);
}

const Send = ({ transaction, price, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        {data.inputs.length > 1 ? <DetailsRow label={t(`from_address`)} data={_.map(data.intputs, (input, i) => <CoinbaseOutput key={i} output={input} price={price} />)} />
          : <DetailsRow label={t(`from_address`)} data={<Address hash={data.inputs[0].address} />} />}
        <DetailsRow label={t(`amount`)} data={_.map(data.outputs, (output, i) => <CoinbaseOutput key={i} output={output} price={price} />)} />
      </tbody>
    </table>);
}

const Slash = ({ transaction, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`proposer_address`)} data={<Address hash={data.proposer.address} />} />
        <DetailsRow label={t(`reserved_sequence`)} data={data.reserved_sequence} />
        <DetailsRow label={t(`slash_proof`)} data={data.slash_proof.substring(0, 12) + '.......'} />
        <DetailsRow label={t(`slashed_address`)} data={<Address hash={data.slashed_address} />} />
      </tbody>
    </table>);
}

const Coinbase = ({ transaction, price, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`proposer`)} data={<Address hash={_.get(data, 'proposer.address')} />}></DetailsRow>
        <DetailsRow label={t(`amount`)} data={_.map(data.outputs, (output, i) => <CoinbaseOutput key={i} output={output} price={price} />)} />
      </tbody>
    </table>);
}

const WithdrawStake = ({ transaction, price, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        <DetailsRow label={t(`stake_addr`)} data={<Address hash={_.get(data, 'holder.address')} />} />
        <DetailsRow label={t(`stake`)} data={<Amount coins={_.get(data, 'source.coins')} price={price} />} />
        <DetailsRow label={t(`purpose`)} data={TxnPurpose[_.get(data, 'purpose')]} />
        <DetailsRow label={t(`staker`)} data={<Address hash={_.get(data, 'source.address')} />} />
      </tbody>
    </table>);
}

const DepositStake = ({ transaction, price,t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`fee`)} data={<Fee transaction={transaction} />} />
        <DetailsRow label={t(`stake_addr`)} data={<Address hash={_.get(data, 'holder.address')} />} />
        <DetailsRow label={t(`stake`)} data={<Amount coins={_.get(data, 'source.coins')} price={price} />} />
        <DetailsRow label={t(`purpose`)} data={TxnPurpose[_.get(data, 'purpose')]} />
        <DetailsRow label={t(`staker`)} data={<Address hash={_.get(data, 'source.address')} />} />
      </tbody>
    </table>);
}

const SmartContract = ({ transaction, t }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label={t(`from_addr`)} data={<Address hash={_.get(data, 'from.address')} />} />
        <DetailsRow label={t(`to_addr`)} data={<Address hash={_.get(data, 'to.address')} />} />

        <DetailsRow label={t(`gas_limit`)} data={data.gas_limit} />
        <DetailsRow label={t(`gas_price`)} data={<span className="currency spay">{gasPrice(transaction) + " SPAY"}</span>} />
        <DetailsRow label={t(`data`)} data={getHex(data.data)} />
      </tbody>
    </table>);
}

export default withTranslation() (TransactionExplorer)



