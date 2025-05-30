import React, { Component, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Link } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';

import { formatCoin, priceCoin, getSCPT } from 'common/helpers/utils';
import { CurrencyLabels } from 'common/constants';
import { accountService } from 'common/services/account';
import { transactionsService } from 'common/services/transaction';
import { stakeService } from 'common/services/stake';
import { priceService } from 'common/services/price';
import { tokenService } from "../common/services/token";
import TokenTxsTable from "common/components/token-txs-table";
import TransactionTable from "common/components/transactions-table";
import Pagination from "common/components/pagination";
import NotExist from 'common/components/not-exist';
import DetailsRow from 'common/components/details-row';
import LoadingPanel from 'common/components/loading-panel';
import StakeTxsTable from "../common/components/stake-txs";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SmartContract from '../common/components/smart-contract';
import { arrayUnique } from "../common/helpers/tns";
import tns from "../libs/tns";
import { useIsMountedRef } from '../common/helpers/hooks';
import { withTranslation } from "react-i18next";

const NUM_TRANSACTIONS = 20;
const today = new Date().toISOString().split("T")[0];
let scrollTimes = 0;
let maxScrollTimes = 1;
class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.getEmptyAccount(this.props.params.accountAddress),
      hasTNT721: false,
      hasTNT20: false,
      hasInternalTxs: false,
      transactions: null,
      currentPage: 1,
      totalPages: null,
      errorType: null,
      loading_acct: false,
      loading_txns: false,
      includeService: false,
      hasOtherTxs: true,
      hasStakes: false,
      hasDownloadTx: false,
      hasStartDateErr: false,
      hasEndDateErr: false,
      price: { 'SCPT': 0, 'SPAY': 0 },
      isDownloading: false,
    };
    this.downloadTrasanctionHistory = this.downloadTrasanctionHistory.bind(this);
    this.download = React.createRef();
    this.startDate = React.createRef();
    this.endDate = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.resetInput = this.resetInput.bind(this);
  }
  getEmptyAccount(address) {
    return {
      address: address.toLowerCase(),
      balance: { scptwei: 0, SPAYWei: 0 },
      sequence: 0,
      reserved_funds: [],
      txs_counter: {}
    }
  }
  componentWillUpdate(nextProps) {
    if (nextProps.params.accountAddress !== this.props.params.accountAddress) {
      this.setState({ hasOtherTxs: true, includeService: false })
      this.fetchData(nextProps.params.accountAddress);
    }
  }

  componentDidUpdate(preProps, preState) {
    if (preProps.params.accountAddress !== this.props.params.accountAddress) {
      this.setState({
        hasOtherTxs: true,
        includeService: false,
        rewardSplit: 0,
        beneficiary: "",
        tabIndex: 0,
        hasToken: false,
        hasTNT20: false,
        hasTNT721: false,
        // tokenBalance: INITIAL_TOKEN_BALANCE // to fetch the token balance
      })
      this.fetchData(this.props.params.accountAddress);
    }
    if (preState.account !== this.state.account
      || preState.transactions !== this.state.transactions
      || preState.hasInternalTxs !== this.state.hasInternalTxs
      || preState.hasTNT20 !== this.state.hasTNT20
      || preState.hasTNT721 !== this.state.hasTNT721) {
      let tabNames = [];
      const { transactions, account, hasInternalTxs, hasTNT20, hasTNT721 } = this.state;
      if (transactions && transactions.length > 0) {
        tabNames.push('Transactions');
      }
      if (account.code && account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470') {
        tabNames.push('Contract');
      }
      if (hasInternalTxs) {
        tabNames.push('InternalTxns')
      }
      if (hasTNT20) {
        tabNames.push('TNT20TokenTxns');
      }
      if (hasTNT721) {
        tabNames.push('TNT721TokenTxns')
      }
      let tabName = this.props.location.hash.replace("#", "").split('-')[0];

      let tabIndex = tabNames.indexOf(tabName) === -1 ? 0 : tabNames.indexOf(tabName);
      if (tabName) {
        maxScrollTimes++;
      } else {
        maxScrollTimes = 0;
      }
      this.handleHashScroll();
      this.setState({ tabNames, tabIndex });
    }
  }

  componentDidMount() {
    const { accountAddress } = this.props.params;
    this.fetchData(accountAddress);
  }
  fetchData(address) {
    this.getOneAccountByAddress(address);
    this.getTransactionsByAddress(address, false, 1);
    this.getStakeTransactions(address);
    // this.getPrices();
    this.getTokenTransactionsNumber(address)
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
              this.setState({ price: { ...this.state.price, 'SCPT': info.price } })
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

  getStakeTransactions(address) {
    if (!address) {
      return;
    }
    stakeService.getStakeByAddress(address)
      .then(res => {
        const stakes = _.get(res, 'data.body');
        this.setState({
          // @TODO need to fix on api response edge node
          edgeNodeTxs: stakes && stakes.edgeNodeRecords ? stakes.edgeNodeRecords : [],
          holderTxs: stakes.holderRecords,
          sourceTxs: stakes.sourceRecords,
          hasStakes: stakes.holderRecords.length + stakes.sourceRecords.length > 0
        })
      })
      .catch(err => {
        console.log(err);
      });
  }
  getTransactionsByAddress(address, includeService, page = 1) {
    if (!address) {
      return;
    }
    this.setState({ loading_txns: true });
    transactionsService.getTransactionsByAddress(address, page, NUM_TRANSACTIONS, includeService)
      .then(res => {
        const txs = _.get(res, 'data.body');
        if (!txs) {
          this.setState({ hasOtherTxs: false, currentPage: 1, totalPages: null, transactions: [] })
          return
        }
        if (txs.length !== 0) {
          this.setState({
            transactions: _.get(res, 'data.body'),
            currentPage: _.get(res, 'data.currentPageNumber'),
            totalPages: _.get(res, 'data.totalPageNumber'),
            loading_txns: false,
          })
        } else {
          this.setState({ hasOtherTxs: false })
          this.handleToggleHideTxn();
        }

      })
      .catch(err => {
        this.setState({ loading_txns: false });
        console.log(err);
      });
  }

  getTokenTransactionsNumber(address) {
    const tokenList = ["SRC-721", "SRC-20", "SCPT"];
    const self = this;
    for (let name of tokenList) {
      tokenService.getTokenTxsNumByAccountAndType(address, name)
        .then(res => {
          // if (!self._isMounted) return;
          const num = _.get(res, 'data.body.total_number');
          if (num > 0) {
            if (name === 'SRC-721') {
              this.setState({ hasTNT721: true });
            } else if (name === 'SRC-20') {
              this.setState({ hasTNT20: true });
            } else if (name === 'SCPT') {
              this.setState({ hasInternalTxs: true });
            }
          }
        })
    }
  }

  getOneAccountByAddress(address) {
    if (!address) {
      return;
    }

    this.setState({ loading_acct: true });
    accountService.getOneAccountByAddress(address)
      .then(res => {
        switch (res.data.type) {
          case 'account':
            this.setState({
              account: res.data.body,
              errorType: null
            })
            break;
          case 'error_not_found':
            break;
          default:
            break;
        }
        this.setState({
          loading_acct: false, hasDownloadTx: (res.data.body.txs_counter[0]
            || res.data.body.txs_counter[2] || res.data.body.txs_counter[5]) !== undefined
        });
      }).catch(err => {
        this.setState({ loading_acct: false });
        console.log(err);
      })
  }

  handlePageChange = pageNumber => {
    let { accountAddress } = this.props.params;
    let { includeService } = this.state;
    this.getTransactionsByAddress(accountAddress, includeService, pageNumber);
  }

  handleToggleHideTxn = () => {
    let { accountAddress } = this.props.params;
    let includeService = !this.state.includeService;
    this.setState({
      includeService,
      currentPage: 1,
      totalPages: null,
    });
    this.getTransactionsByAddress(accountAddress, includeService, 1);
  }

  downloadTrasanctionHistory() {
    const { accountAddress } = this.props.params;
    const startDate = (new Date(this.startDate.value).getTime() / 1000).toString();
    const endDate = (new Date(this.endDate.value).getTime() / 1000).toString();
    let hasStartDateErr = false, hasEndDateErr = false;
    if (this.startDate.value === '' || this.endDate.value === '') {
      if (this.startDate.value === '') hasStartDateErr = true;
      if (this.endDate.value === '') hasEndDateErr = true;
      this.setState({ hasStartDateErr, hasEndDateErr })
      return
    }
    this.setState({ isDownloading: true })
    accountService.getTransactionHistory(accountAddress, startDate, endDate)
      .then(res => {
        if (res.status === 200) {
          function convertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            var line = '';
            for (var index in array[0]) {
              if (line != '') line += ','
              line += index;
            }
            str += line + '\r\n';
            for (var i = 0; i < array.length; i++) {
              var line = '';
              for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
              }

              str += line + '\r\n';
            }
            return str;
          }
          var json = JSON.stringify(res.data.body);
          var csv = convertToCSV(json);
          var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          // var blob = new Blob([json], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          this.download.current.download = 'transactions.csv';
          this.download.current.href = url;
          this.download.current.click();
          this.setState({ isDownloading: false })
        }
      });
  }
  handleInput(type) {
    if (type === 'start') {
      let date = new Date(this.startDate.value)
      date.setDate(date.getDate() + 7);
      this.endDate.min = this.startDate.value;
      let newDate = this.getDate(date);
      this.endDate.max = newDate < today ? newDate : today;
    } else if (type === 'end') {
      let date = new Date(this.endDate.value)
      date.setDate(date.getDate() - 7);
      this.startDate.max = this.endDate.value;
      this.startDate.min = this.getDate(date);
    }
    if (type === 'start' && !this.hasStartDateErr) this.setState({ hasStartDateErr: false })
    if (type === 'end' && !this.hasEndDateErr) this.setState({ hasEndDateErr: false })
  }
  getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return year + '-' + month + '-' + day;
  }
  resetInput() {
    this.startDate.value = '';
    this.startDate.max = today;
    this.startDate.min = '';
    this.endDate.value = '';
    this.endDate.max = today;
    this.endDate.min = '';
  }

  handleHashScroll = () => {
    let tabName = this.props.location.hash.replace("#", "").split('-')[0];
    if (tabName && this.tabRef && scrollTimes < maxScrollTimes) {
      setTimeout(() => this.tabRef.scrollIntoView({ behavior: "smooth" }));
      scrollTimes++;
    }
  }

  render() {
    const { t, truncate } = this.props
    const { account, transactions, currentPage, totalPages, errorType, loading_txns,
      includeService, hasOtherTxs, hasStakes, holderTxs, edgeNodeTxs, hasDownloadTx, sourceTxs,
      price, hasStartDateErr, hasEndDateErr, isDownloading, hasTNT20, hasTNT721, hasToken,
      hasInternalTxs } = this.state;
    return (
      <div className="content account">
        <div className="page-title account"> {t(`account_detail`)}</div>
        {errorType === 'error_not_found' &&
          <NotExist msg="Note: An account will not be created until the first time it receives some tokens." />}
        {account && !errorType &&
          <React.Fragment>
            <table className="details account-info">
              <thead>
                <tr>
                  <th>{t(`address`)}</th>
                  <th>{account.address}</th>
                </tr>
              </thead>
              <tbody>
                <DetailsRow label={t(`balance`)} data={<Balance balance={account.balance} price={price} />} />
                <DetailsRow label={t(`sequence`)} data={account.sequence} />
              </tbody>
            </table>
          </React.Fragment>}
        {hasStakes &&
          <div className="stake-container">
            {sourceTxs.length > 0 && <StakeTxsTable type='source' txs={sourceTxs} price={price} />}
            {holderTxs.length > 0 && <StakeTxsTable type='holder' txs={holderTxs} price={price} />}
            {/* {edgeNodeTxs.length > 0 && <StakeTxsTable type='edgeNode' txs={edgeNodeTxs} price={price} />} */}
          </div>
        }

        <Tabs>
          <TabList>
            {transactions && transactions.length && <Tab>{t(`transactions`)}</Tab>}
            {account.code && account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' &&
              <Tab>Contract</Tab>
            }
            {hasInternalTxs && <Tab>{t(`internal_txns`)}</Tab>}
            {hasTNT20 && <Tab>{t(`SRC_20_token_txns`)}</Tab>}
            {hasTNT721 && <Tab>{t(`SRC_721_token_txns`)}</Tab>}
          </TabList>
          {transactions && transactions.length > 0 && <TabPanel>
            {
              loading_txns ? <LoadingPanel /> : 
              transactions && transactions.length &&
                <React.Fragment>
                  <div className="actions">
                    {hasDownloadTx && <Popup trigger={<div className="download btn tx export">{t(`export_transaction_history_csv`)}</div>} position="right center">
                      <div className="popup-row header">{t(`choose_the_time_period_must_within_7days`)}</div>
                      <div className="popup-row">
                        <div className="popup-label">{t(`start_date`)}:</div>
                        <input className="popup-input" type="date" ref={input => this.startDate = input} onChange={() => this.handleInput('start')} max={today}></input>
                      </div>
                      <div className={cx("popup-row err-msg", { 'disable': !hasStartDateErr })}>Input Valid Start Date</div>
                      <div className="popup-row">
                        <div className="popup-label">{t(`end_date`)}: </div>
                        <input className="popup-input" type="date" ref={input => this.endDate = input} onChange={() => this.handleInput('end')} max={today}></input>
                      </div>
                      <div className={cx("popup-row err-msg", { 'disable': !hasEndDateErr })}>{t(`input_valid_end_date`)}</div>
                      <div className="popup-row buttons">
                        <div className={cx("popup-reset", { disable: isDownloading })} onClick={this.resetInput}>{t(`reset`)}</div>
                        <div className={cx("popup-download export", { disable: isDownloading })} onClick={this.downloadTrasanctionHistory}>{t(`download`)}</div>
                        <div className={cx("popup-downloading", { disable: !isDownloading })}>{t(`downloading`)}......</div>
                      </div>
                    </Popup>}
                    <a ref={this.download}></a>
                    <div className="title">{t(`transactions`)}</div>
                    {/* {hasOtherTxs &&
                      <div className="switch">
                        <button className="btn tx">{includeService ? 'Hide' : 'Show'} Service Payments</button>
                        <label className="scpt-switch">
                          <input type="checkbox" checked={includeService} onChange={this.handleToggleHideTxn}></input>
                          <span className="scpt-slider"></span>
                        </label>
                      </div>
                    } */}
      
                  </div>
                  <div>
                    {loading_txns &&
                      <LoadingPanel className="fill" />}
                    <TransactionTable transactions={transactions} account={account} price={price} />
                  </div>
                  {!transactions && loading_txns && <LoadingPanel />}
                  <Pagination
                    size={'lg'}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                    disabled={loading_txns} />
                </React.Fragment>
            }
          </TabPanel>}
          {account.code && account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' && <TabPanel>
              <SmartContract address={account.address} handleHashScroll={this.handleHashScroll} urlHash={location.hash} />
            </TabPanel>
          }
          {hasInternalTxs && <TabPanel>
            <TokenTab type="SCPT" address={account.address} handleHashScroll={this.handleHashScroll} t={t} />
          </TabPanel>}
          {hasTNT20 && <TabPanel>
            <TokenTab type="SRC-20" address={account.address} handleHashScroll={this.handleHashScroll} t={t} />
            </TabPanel>}
          {hasTNT721 && <TabPanel>
              <TokenTab type="SRC-721" address={account.address} handleHashScroll={this.handleHashScroll} t={t} />
            </TabPanel>}
        </Tabs>
      </div>);
  }
}

const TokenTab = props => {
  const { type, address, handleHashScroll, t } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [tokenMap, setTokenMap] = useState({});
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    fetchTokenTransactions(address, type, currentPage);
  }, [type, address])

  const handlePageChange = pageNumber => {
    fetchTokenTransactions(address, type, pageNumber);
  }

  const setTokensTNS = async (transactions) => {
    const uniqueAddresses = arrayUnique(
      transactions.map((x) => x.from)
        .concat(transactions.map((x) => x.to))
    );
    const domainNames = await tns.getDomainNames(uniqueAddresses);
    transactions.map((transaction) => {
      // transaction.fromTns = transaction.from ? domainNames[transaction.from] : null;
      // transaction.toTns = transaction.to ? domainNames[transaction.to] : null;
      transaction.fromTns = transaction.from;
      transaction.toTns = transaction.to;
    });
    
    if (!isMountedRef.current) return;
    setTransactions(transactions);
  }


  const fetchTokenTransactions = (address, type, page) => {
    tokenService.getTokenTxsByAccountAndType(address, type, page, NUM_TRANSACTIONS)
      .then(res => {
        if (!isMountedRef.current) return;
        let txs = res.data.body;
        txs = txs.sort((a, b) => b.timestamp - a.timestamp);
        setTotalPages(res.data.totalPageNumber);
        setCurrentPage(res.data.currentPageNumber);
        setLoadingTxns(false);
        setTokensTNS(txs);
        let addressSet = new Set();
        txs.forEach(tx => {
          if (tx.contract_address) {
            addressSet.add(tx.contract_address);
          }
        })
        if (addressSet.size === 0) {
          return;
        }
        tokenService.getTokenInfoByAddressList([...addressSet])
          .then(res => {
            if (!isMountedRef.current) return;
            let infoList = _.get(res, 'data.body') || [];
            let map = {};
            infoList.forEach(info => {
              map[info.contract_address] = {
                name: info.name,
                decimals: info.decimals
              }
            })
            setTokenMap(map);
          })
          .catch(e => console.log(e.message))
      })
      .catch(e => {
        setLoadingTxns(false);
      })
  }

  return <>
    <div>
      {loadingTxns &&
        <LoadingPanel className="fill" />}
      {!loadingTxns && <TokenTxsTable transactions={transactions} type={type} address={address} tokenMap={tokenMap} handleHashScroll={handleHashScroll} t={t} />}
    </div>
    <Pagination
      size={'lg'}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      disabled={loadingTxns} />
  </>
}

const Balance = ({ balance, price }) => {
  return (
    <div className="act balance">
      {_.map(balance, (v, k) => <div key={k} className={cx("currency", k)}>
        {`${formatCoin(v)} ${CurrencyLabels[k] }`}
        <div className='price'>{`[\$${priceCoin(v, price[CurrencyLabels[k]])} USD]`}</div>
      </div>)}
    </div>)
}

const Address = ({ hash }) => {
  return (<Link to={`/account/${hash}`} target="_blank">{hash}</Link>)
}

const HashList = ({ hashes }) => {
  return (
    <React.Fragment>
      {_.map(_.compact(hashes), (hash, i) => <div key={i}><Link key={hash} to={`/txs/${hash.toLowerCase()}`}>{hash.toLowerCase()}</Link></div>)}
    </React.Fragment>
  )
}

const fetchTokenTransactions = (address, type, page) => {
  tokenService.getTokenTxsByAccountAndType(address, type, page, NUM_TRANSACTIONS)
    .then(res => {
      if (!isMountedRef.current) return;
      let txs = res.data.body;
      txs = txs.sort((a, b) => b.timestamp - a.timestamp);
      setTotalPages(res.data.totalPageNumber);
      setCurrentPage(res.data.currentPageNumber);
      setLoadingTxns(false);
      setTokensTNS(txs);
      let addressSet = new Set();
      txs.forEach(tx => {
        if (tx.contract_address) {
          addressSet.add(tx.contract_address);
        }
      })
      if (addressSet.size === 0) {
        return;
      }
      tokenService.getTokenInfoByAddressList([...addressSet])
        .then(res => {
          if (!isMountedRef.current) return;
          let infoList = _.get(res, 'data.body') || [];
          let map = {};
          infoList.forEach(info => {
            map[info.contract_address] = {
              name: info.name,
              decimals: info.decimals
            }
          })
          setTokenMap(map);
        })
        .catch(e => console.log(e.message))
    })
    .catch(e => {
      setLoadingTxns(false);
    })
}

export default withTranslation() (AccountDetails)
