import React, { Component } from "react";
import _ from "lodash";
import cx from "classnames";

import { sumCoin } from "common/helpers/utils";
import { transactionsService } from "common/services/transaction";
import { tokenService } from "../services/token";
import { stakeService } from "common/services/stake";
import { blocksService } from "common/services/block";
import { accountService } from "common/services/account";
import SCPTChart from "common/components/chart";

import BigNumber from "bignumber.js";
import { formatCurrency } from "../constants";
import { withTranslation } from "react-i18next";
import TotalDataContext from "../../contexts/TotalDataContext";

class TokenDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNum: 0,
      txnNum: 0,
      totalStaked: 0,
      holders: [],
      percentage: [],
      txTs: [],
      txNumber: [],
      nodeNum: 0,
      totalSCPTValue: 0,
      totalSPAYValue: 0,
      totalValidatorNode: 0,
      totalLightningNode: 0,
      totalAccount: 0,
      totalActiveWallet: 0,
      stakeNodeList: [],
      contextUpdated: false,
    };
  }

  static contextType = TotalDataContext;

  componentDidMount() {
    this.getTotalStaked();
    this.getAllStakes();
    this.getTransactionNumber();
    this.getBlockNumber();
    this.getTransactionHistory();
    this.getCircularSupplyData();
    this.getTotalAccountNumber();
    this.getActiveWallets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.context !== this.context && !this.state.contextUpdated) {
      const { scpt, spay, nodes } = this.context;

      if (this.context) {
        this.setState({
          totalSCPTValue: scpt.totalWeiValue,
          totalSPAYValue: spay.totalWeiValue,
          totalLightningNode: nodes.num_ln,
          totalValidatorNode: nodes.num_vn,
          contextUpdated: true,
        });
      }
    }
  }
  getActiveWallets() {
    accountService
      .getActiveWallets()
      .then((res) => {
        this.setState({
          totalActiveWallet: res.data.body.amount,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTotalAccountNumber() {
    accountService
      .getTotalAccount()
      .then((res) => {
        this.setState({
          totalAccount: 37436 + 2811 + res.data.total_number_account,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCircularSupplyData() {
    tokenService
      .getCirculatingSuppyData()
      .then((res) => {
        this.setState({
          totalSCPTValue: res.data.totalScptWeiValue,
          totalSPAYValue: res.data.totalSpayWeiValue,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTransactionHistory() {
    transactionsService
      .getTransactionHistory()
      .then((res) => {
        const txHistory = _.get(res, "data.body.data");
        let txTs = [];
        let txNumber = [];
        txHistory
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((info) => {
            txTs.push(new Date(info.timestamp * 1000));
            txNumber.push(info.number);
          });
        this.setState({ txTs, txNumber });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllStakes() {
    stakeService
      .getAllStake()
      .then((res) => {
        const stakeList = _.get(res, "data.body");
        let sum = stakeList.reduce((sum, info) => {
          return sumCoin(sum, info.amount);
        }, 0);
        let newObj = stakeList.reduce((map, obj) => {
          if (!map[obj.holder]) map[obj.holder] = 0;
          map[obj.holder] = sumCoin(map[obj.holder], obj.amount).toFixed();
          return map;
        }, {});
        let topStakes = Array.from(Object.keys(newObj), (key) => {
          return { holder: key, amount: newObj[key] };
        })
          .sort((a, b) => {
            return b.amount - a.amount;
          })
          .slice(0, 8);
        let sumPercent = 0;
        let objList = topStakes
          .map((stake) => {
            let obj = {};
            obj.holder = stake.holder;
            obj.percentage = new BigNumber(stake.amount)
              .dividedBy(sum / 100)
              .toFixed(2);
            sumPercent += obj.percentage - "0";
            return obj;
          })
          .concat({
            holder: "Rest Nodes",
            percentage: (100 - sumPercent).toFixed(2),
          });
        console.log(objList);
        this.setState({
          holders: objList.map((obj) => {
            return obj.holder;
          }),
          percentage: objList.map((obj) => {
            return obj.percentage - "0";
          }),
          stakeNodeList:
            objList && objList.length > 2 ? objList.slice(0, 3) : objList,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getTransactionNumber() {
    transactionsService
      .getTotalTransactionNumber(24)
      .then((res) => {
        const txnNum = _.get(res, "data.body.total_num_tx");
        this.setState({ txnNum });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getBlockNumber() {
    blocksService
      .getTotalBlockNumber(24)
      .then((res) => {
        const blockNum = _.get(res, "data.body.total_num_block");
        this.setState({ blockNum });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getTotalStaked() {
    stakeService
      .getTotalStakeNode()
      .then((res) => {
        this.setState({
          totalStaked: res.data.nodeCount,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const {
      blockNum,
      txnNum,
      totalStaked,
      holders,
      percentage,
      txTs,
      txNumber,
      nodeNum,
      totalSCPTValue,
      totalSPAYValue,
      totalValidatorNode,
      totalLightningNode,
      totalAccount,
      stakeNodeList,
      totalActiveWallet,
    } = this.state;
    const { tokenInfo, type, t } = this.props;
    const icon = type + "wei";
    const token = type.toUpperCase();
    const totalStakePercent = (
      ((totalValidatorNode + totalLightningNode) / 1000000000) *
      100
    ).toFixed(2);

    return (
      // <React.Fragment>
      //   {(type === 'scpt' && type === 'spay') &&
      //     <div>sdfsdfsdfsd</div>

      //   }
      //   <div className={cx("tokens dashboard", type)}>
      //     {/* <div className="column">
      //       <div className={cx("currency", icon)}></div>
      //     </div> */}
      //     <div className="row">
      //       {/* {type === 'scpt' && */}
      //         <><div className="col-md-3 column">
      //           <Detail title={`SCPT PRICEs (USD)`} value={`0.10`} />
      //         </div><div className="col-md-3 column">
      //             <Detail title={'MARKET CAP (USD)'} value={1000000000} />
      //           </div></>
      //       {/* } */}
      //       {/* {type === 'spay' && */}
      //         <><div className=" col-md-3 column">
      //           <Detail title={`SPAY PRICE (USD)`} value={`0.10`} />
      //         </div><div className="col-md-3 column">
      //             <Detail title={'MARKET CAPs (USD)'} value={1000000000} />
      //           </div></>
      //       {/* } */}
      //     </div>
      //     <div className="row">
      //       <div className="col-md-3 column">
      //         <Detail title={'24 HR VOLUME (USD)'} value={formatCurrency(10000000, 0)} />
      //       </div>
      //       <div className="col-md-3 column">
      //         <Detail title={'CIRCULATING SUPPLY'} value={formatNumber(1000000000)} />
      //       </div>

      //       {/* {type === 'scpt' && */}
      //         <><div className=" col-md-3 column">
      //           <Detail title={'TOTAL STAKED NODES'} value={nodeNum} />
      //         </div><div className=" col-md-3 column">

      //             <Detail title={'TOTAL STAKED (%)'} value={<StakedPercent staked={totalStaked} />} />
      //           </div></>

      //       {/* } */}
      //     </div>
      //     <div className="row">
      //       {/* {type === 'spay' && */}
      //        <><div className="col-md-3 column newFlex">
      //         <div className="newMarginxm"> <Detail title={'24 HR BLOCKS'} value={formatNumber(blockNum)} /></div> </div>
      //         <div className="col-md-3 column newFlex">
      //           <div className="newMargin"> <Detail title={'24 HR TRANSACTIONS'} value={<TxnNumber num={txnNum} />} /></div></div></>

      //       {/* } */}
      //       {/* {type === 'spay' ? */}
      //       </div>
      //       <div className="row">
      //        <div className="col-md-6 column newFlex">
      //        <div className="chart-container">
      //             <div className="title">SCRIPT NODES</div>
      //             <SCPTChart chartType={'doughnut'} labels={holders} data={percentage} clickType={'stake'} />
      //           </div>
      //       </div>
      //         <div className="col-md-6 column newFlex">

      //           <div className="chart-container">
      //           <div className="title">SCRIPT TRANSACTION HISTORY (14 DAYS)</div>
      //           <SCPTChart chartType={'line'} labels={txTs} data={txNumber} clickType={''} />
      //         </div>
      //         </div>
      //         {/* } */}

      //     </div>

      //   </div>

      // </React.Fragment>

      <React.Fragment>
        <div>
          <div className="staking-head">
            <div className="staking">{t(`staking`)}</div>
            <div className="staking-line"></div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail title={t(`script_token_usd`)} value={`0.01`} />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail title={t(`script_pay_usd`)} value={"0.0005"} />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`market_cap_scpt_usd`)}
                  value={`${formatCurrency((1000000000 * 0.01).toFixed(4))}`}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`market_cap_spay_usd`)}
                  value={`${formatCurrency((5000000000 * 0.0005).toFixed(4))}`}
                />
              </div>
            </div>

            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`validator_stake`)}
                  value={formatCurrency(totalValidatorNode)}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`lightning_stake`)}
                  value={formatCurrency(totalLightningNode)}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail title={t(`total_staked_nodes`)} value={totalStaked} />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`total_staked_percentage`)}
                  value={`${totalStakePercent}%`}
                />
              </div>
            </div>

            <div className="col-md-3 col-sm-6 grid-col">
              {/* stake-dashed-card */}
              <div className="stake-card">
                <Detail
                  title={t(`24h_blocks`)}
                  value={formatCurrency(blockNum)}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`24h_transactions`)}
                  value={formatCurrency(txnNum)}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`total_onchain_wallets`)}
                  value={formatCurrency(totalAccount)}
                />
              </div>
            </div>
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`daily_active_wallets`)}
                  value={formatCurrency(totalActiveWallet)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 grid-col">
              <div className="stake-card">
                <Detail
                  title={t(`ecosystem_users`)}
                  value={formatCurrency(totalActiveWallet)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 column newFlex">
              <div className="doughnut-chart-container">
                <div className="title-wrapper">
                  <h1 className="title">{t(`script_nodes`)}</h1>
                  <div className="info-icon-wrapper">
                    <img src="../images/icons/info-icon.png" alt="" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="chart-wrapper">
                      <SCPTChart
                        chartType={"doughnut"}
                        labels={holders}
                        data={percentage}
                        clickType={"stake"}
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <ul className="node-list">
                      {stakeNodeList && stakeNodeList.length > 0
                        ? stakeNodeList.map((stake, key) => (
                            <li
                              key={key}
                            >{`${stake.percentage}% ${stake.holder}`}</li>
                          ))
                        : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 column newFlex">
              <div className="line-chart-container">
                <div className="title">
                  {t(`script_transaction_history_14_days`)}
                </div>
                <SCPTChart
                  chartType={"line"}
                  labels={txTs}
                  data={txNumber}
                  clickType={""}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const Detail = ({ title, value }) => {
  return (
    <div className="detail">
      <div className="title">{title}</div>
      <div className={cx("value", { price: title.includes("Price") })}>
        {value}
      </div>
    </div>
  );
};

<style></style>;

export default withTranslation()(TokenDashboard);
