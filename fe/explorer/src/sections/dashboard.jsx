import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router";
import LatestBlocks from "./latest-blocks";
import { blocksService } from "../common/services/block";
import { stakeService } from "../common/services/stake";
import { tokenService } from "../common/services/token";
import {
  formatCurrency,
  numberToBillion,
  numberToMillion,
} from "../common/constants";
import { sumCoin, truncateMiddle } from "../common/helpers/utils";
import SCPTChart from "common/components/chart";
import BigNumber from "bignumber.js";
import { transactionsService } from "common/services/transaction";
import { accountService } from "common/services/account";
import ApexCharts from "../common/components/ApexCharts";
import ReactModal from "react-modal";
import CalculatorModal from "../common/components/calculatorModal";
import TotalDataContext from "../contexts/TotalDataContext";
const socialLinks = [
  {
    img: "/images/social_icon_1.png",
    link: "https://medium.com/script-network",
    name: "medium",
  },
  {
    img: "/images/social_icon_2.png",
    link: "https://www.instagram.com/script_network/",
    name: "instagram",
  },
  {
    img: "/images/social_icon_3.png",
    link: "https://twitter.com/script_network",
    name: "twitter",
  },
  {
    img: "/images/social_icon_4.png",
    link: "https://t.me/scriptnetworkann",
    name: "telegram",
  },
  {
    img: "/images/social_icon_5.png",
    link: "https://discord.gg/scriptnetwork",
    name: "discord",
  },
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNum: 0,
      txnNum: 0,
      topBlocks: {},
      blockTime: 0,
      totalValidators: 0,
      totalLightning: 0,
      totalEdge: 0,
      totalSCPTValue: 0,
      totalSPAYValue: 0,
      totalBalanceSPCT: 0,
      totalBalanceSPAY: 0,
      holders: [],
      percentage: [],
      stakeNodeList: [],
      txTs: [],
      txNumber: [],
      totalAccount: 0,
      totalActiveWallet: 0,
      totalValidatorNode: 0,
      totalLightningNode: 0,
      modalIsOpen:false,
      chartFilter:'Day',
      contextUpdated: false,
    };
    this.getSupplyData = this.getSupplyData.bind(this);
    this.getTopBlocks = this.getTopBlocks.bind(this);
    this.getStakes = this.getStakes.bind(this);
    this.getAllStakes = this.getAllStakes.bind(this);
    this.getBlockNumber = this.getBlockNumber.bind(this);
    this.getTransactionNumber = this.getTransactionNumber.bind(this);
    this.getTransactionHistory = this.getTransactionHistory.bind(this);
    this.getTotalAccountNumber = this.getTotalAccountNumber.bind(this);
    this.getActiveWallets = this.getActiveWallets.bind(this);
  }
  static contextType = TotalDataContext; 

  componentDidMount() {
    this.getSupplyData();
    this.getTopBlocks();
    this.getStakes();
    this.getAllStakes();
    this.getBlockNumber();
    this.getTransactionNumber();
    this.getTransactionHistory();
    this.getTotalAccountNumber();
    this.getActiveWallets();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if a specific variable has changed
    if (this.state.chartFilter !== prevState.chartFilter) {
      // Run the function when the variable changes
      if(this.state.chartFilter=='Day'){
        this.getTransactionHistory()
      }else{
      this.FilterTransactionHistory();
      }
    }

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

  getTransactionHistory() {
    transactionsService
      .getTransactionHistoryByHour()
      .then((res) => {
        const txHistory = _.get(res, "data.body.data");
        let txTs = [];
        let txNumber = [];
        txHistory
          .sort((a, b) => b.timestamp_unix - a.timestamp_unix)
          .forEach((info, index) => {
           
              txTs.push(new Date(info.timestamp_unix).toUTCString());
              txNumber.push(info.num_txs);
            
          });
        this.setState({ txTs, txNumber });
      })
      .catch((err) => {
        console.log(err);
      });
  }
FilterTransactionHistory(){
  transactionsService.getTransactionHistoryByFilter(this.state.chartFilter).then(res=>{
    console.log(res.data)
    let txHistory = _.get(res, "data.body.data");
    let txTs = [];
    let txNumber = [];
    txHistory=txHistory.map(tx=>{
      if(this.state.chartFilter=='Week' || this.state.chartFilter=='Monthly'||this.state.chartFilter=='Quarterly')
      return {
    ...tx,
        timestamp_unix:new Date(tx._id.year,tx._id.month-1,tx._id.day),

      }
      if(this.state.chartFilter=='Yearly'){
        return {
          ...tx,
              timestamp_unix:new Date(tx._id.year,tx._id.month-1),
      
            }
      }
    })
    txHistory
    .sort((a, b) => b.timestamp_unix - a.timestamp_unix)
    .forEach((info, index) => {
     
        txTs.push(new Date(info.timestamp_unix).toUTCString());
        txNumber.push(info.num_txs);
      
    });
  this.setState({ txTs, txNumber });

  })
}
  getSupplyData() {
    tokenService
      .getCirculatingSuppyData()
      .then((res) => {
        if (res && res.data) {
          this.setState({
            totalSCPTValue: res.data.totalScptWeiValue,
            totalSPAYValue: res.data.totalSpayWeiValue,
            totalBalanceSPCT: res.data.totlAccountBalance.scptwei,
            totalBalanceSPAY: res.data.totlAccountBalance.spaywei,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getStakes() {
    stakeService.getAllStake().then((res) => {
      if (res && res.data && res.data.body && res.data.body.length) {
        const totalVCP = res.data.body.filter(
          (validator) => validator.type === "vcp"
        ).length;
        const totalGCP = res.data.body.filter(
          (validator) => validator.type === "gcp"
        ).length;
        const totalEENP = res.data.body.filter(
          (validator) => validator.type === "eenp"
        ).length;
        this.setState({
          totalValidators: totalVCP,
          totalLightning: totalGCP,
          totalEdge: totalEENP,
        });
      }
    });
  }

  getTopBlocks() {
    blocksService.getBlocksByPage(1).then((res) => {
      if (res && res.status === 200) {
        const secondLastBlock = res.data.body[res.data.body.length - 2];
        const lastBlock = res.data.body[res.data.body.length - 1];
        const avgTime =
          parseInt(lastBlock.timestamp) - parseInt(secondLastBlock.timestamp);
        this.setState({ topBlocks: lastBlock, blockTime: avgTime });
      } else {
        this.setState({ topBlocks: {}, blockTime: 0 });
      }
    });
  }
   openModal=()=> {
    this.setState({modalIsOpen:true});

  }

   afterOpenModal() {
    // references are now sync'd and can be accessed.
  
  }
  changeChart=(filterOption)=>{
    this.setState({chartFilter:filterOption})
  }

   closeModal=()=> {
    console.log('close')
    this.setState({modalIsOpen:false});
  }

  render() {
    const { t } = this.props;
    const {
      topBlocks,
      txnNum,
      blockTime,
      blockNum,
      totalValidators,
      totalSCPTValue,
      totalSPAYValue,
      holders,
      percentage,
      stakeNodeList,
      txTs,
      totalLightning,
      totalEdge,
      txNumber,
      chartFilter,
      totalBalanceSPCT,
      totalBalanceSPAY,
      totalAccount,
      totalActiveWallet,
      totalValidatorNode,
      totalLightningNode,
      modalIsOpen
    } = this.state;
    return (
      <>
       <ReactModal
        isOpen={modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={{content:{backgroundColor:'rgb(44 44 44/1)',maxWidth:'70%',width:'50%',borderRadius:'10px',left:'0',right:'0',margin:'auto',padding:'2rem'}}}
        contentLabel="Example Modal"
      >
        <CalculatorModal closeModal={this.closeModal}></CalculatorModal>
      </ReactModal>
         <div className="main-wrapper mb-4 ">
          <div className="col-md-6 p-2  border-rounded default-back ">
            <h3>Staking Reward</h3>
            <div className="d-flex ">
              <div className="col1">
                <p className="mb-4">By staking your INJ, you earn rewards and help keep the Injective network secure. </p>
                <div className="d-flex align-items-center">
                  <button className="btn-with-primary border bg-primary border-rounded gap-2">Delegate Now</button>
                  <a className="calc-reward" onClick={this.openModal}>Calculate Rewards</a>
                </div>
              </div>
              <div className="col2">
                <div className="show-circle">APR 16.37%</div>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-2 border-rounded default-back">
            <h3>Script Web Wallet</h3>
            <p>
              Connect and manage your account
            </p>
            <button className="btn-with-primary border bg-primary border-rounded gap-2 mt-2" onClick={() => window.open('https://wallet.script.tv/', '_blank')}>
              Wallet
            </button>
          </div>
        </div>
        <div className="page-title transactions">Overview  <span style={{display:'inline-block',position: 'absolute',
    right: '298px'}}>Block</span></div>
     
        <div className="main-wrapper">
          <div className="left-container">
         
              <div class="text-center" style={{marginBottom:'2rem',marginTop:'.5rem'}}>
                <div class="inline-flex w-auto filter-options  flex-wrap justify-center rounded-2xl bg-gray p-px ">
                  <button type="button" role="button" onClick={(e)=>this.changeChart('All')} className={`filter-btn ${chartFilter==='All'?'selected':''}`}>All</button>
                  <button type="button" role="button" onClick={(e)=>this.changeChart('Day')} className={`filter-btn ${chartFilter==='Day'?'selected':''}`}>Day</button>
                  <button type="button" role="button" onClick={(e)=>this.changeChart('Week')} className={`filter-btn ${chartFilter==='Week'?'selected':''}`}>Week</button>
                  <button type="button" role="button" onClick={(e)=>this.changeChart('Yearly')} className={`filter-btn ${chartFilter==='Yearly'?'selected':''}`}>1 Year</button>
                  <button type="button" role="button" onClick={(e)=>this.changeChart('Monthly')} className={`filter-btn ${chartFilter==='Monthly'?'selected':''}`}>1 Month</button>
                  <button type="button" role="button" onClick={(e)=>this.changeChart('Quarterly')} className={`filter-btn ${chartFilter==='Quarterly'?'selected':''}`}>3 months</button>
                  </div></div>
             
            <div className="graph-wrapper">
              
              <ApexCharts txTs={txTs} data={txNumber} filterOption={chartFilter} />
              {/* <SCPTChart
                chartType={"line"}
                labels={txTs}
                data={txNumber}
                clickType={""}
              /> */}
            </div>
            <div className="d-flex justify-content-around mt-2">
              <div className="show-detail">
             
                <p> $0.01 </p> 
                <p>SCPT</p>
              </div>
              <div className="show-detail">
              <p>$10,000,000</p>
                  <p>Market Cap</p>
               
              </div>
              <div className="show-detail">
            
                <p> $0.0005</p>
                <p>SPAY</p>
                
              </div>
            
              <div className="show-detail">
              <p> $2,500,000 </p>
                <p>Market Cap</p>
              </div>
            </div>
          </div>
          <div className="right-container default-back">

            {/* <div className="chain-summary">
              <div className="latest-block">
                <p className="label">Latest Block</p>
                <a href={`/blocks/${topBlocks.height}`} className="value">
                  {topBlocks.height ? topBlocks.height : 0}
                </a>
              </div>
              <div className="block-time">
                <p className="label">Block Time</p>
                <p className="value">{blockTime}s</p>
              </div>
              <div className="chain">
                <p className="label">Chain</p>
                <p className="value">Script</p>
              </div>
            </div>
            <div className="apr-inflation-wrapper">
              <div className="apr-wrapper">
                <p className="label">Validators</p>
                <p className="value">{totalValidators}</p>
              </div>
              <div className="inflation-wrapper">
                <p className="label">Total Nodes</p>
                <p className="value">
                  {totalValidators + totalLightning + totalEdge}
                </p>
              </div>
            </div> */}
            <LatestBlocks/>
          </div>
        </div>
        <div className="token-wrapper">
          <div className="left-container">
            {/* <div className="token-summary">
                            <p className="title">
                                Online Voting Power
                            </p>
                            <div className="detail">
                                <p className="value">
                                    707.56m
                                    <span>
                                    from
                                    </span>
                                    707.56m
                                </p>
                                <p className="percentage">
                                    {1 * 100}%
                                </p>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${1 * 100}%` }}
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div> */}
            {/* <div className="token-summary">
              <p className="title">Community Pool (SCPT)</p>
              <div className="detail">
                <p className="value">
                  {formatCurrency(totalBalanceSPCT)}
                
                </p>
             
              </div>
         
            </div> */}
            {/* <div className="token-summary">
              <p className="title">Community Pool (SPAY)</p>
              <div className="detail">
                <p className="value">
                  {formatCurrency(totalBalanceSPAY)}
             
                </p>
            
              </div>
            
            </div> */}
            {/* <div className="token-summary">
              <p className="title">Circulating Supply (SCPT)</p>
              <div className="detail">
                <p className="value">{formatCurrency(1000000000)}</p>
              </div>
            </div>
            <div className="token-summary">
              <p className="title">Circulating Supply (SPAY)</p>
              <div className="detail">
                <p className="value">
                 
                  {formatCurrency(5000000000)}
                </p>
              </div>
            </div> */}
            {/* <div className="token-summary">
                            <p className="title">
                                Community Pool
                            </p>
                            <div className="detail">
                                <p className="value">
                                    1 818 171 AXL
                                </p>
                            </div>
                        </div> */}
          </div>
          {/* <div className="right-container">
            <div className="tokenomics-wrapper">
              <p className="title">Staking</p>
              <div className="chartBox">
                <SCPTChart
                  chartType={"doughnut"}
                  labels={holders}
                  data={percentage}
                  clickType={"stake"}
                />
                <div>
                  <ul className="node-list">
                    {stakeNodeList && stakeNodeList.length > 0
                      ? stakeNodeList.map(
                          (stake, key) =>
                            key < 5 && (
                              <li key={key}>
                                {`${stake.percentage}%`}
                                <Link href={`account/${stake.holder}`}>
                                  {" "}
                                  {stake.holder}
                                </Link>
                              </li>
                            )
                        )
                      : null}
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* <div className="wallet-wrapper">
          <div className="custom-card">
            <p className="title">24H Blocks</p>
            <p className="value">{formatCurrency(blockNum)}</p>
          </div>
          <div className="custom-card">
            <p className="title">24H Transactions</p>
            <p className="value">{formatCurrency(txnNum)}</p>
          </div>
          <div className="custom-card">
            <p className="title">Total OnChain Wallets</p>
            <p className="value">{formatCurrency(totalAccount)}</p>
          </div>
        </div>
        <div className="wallet-wrapper">
          <div className="custom-card">
            <p className="title">Daily Active Wallets</p>
            <p className="value">{formatCurrency(totalActiveWallet)}</p>
          </div>
          <div className="custom-card">
            <p className="title">Validator Staked (SCPT)</p>
            <p className="value">{formatCurrency(totalValidatorNode)}</p>
          </div>
          <div className="custom-card">
            <p className="title">Lightning Staked (SCPT)</p>
            <p className="value">{formatCurrency(totalLightningNode)}</p>
          </div>
        </div> */}
        {/* <div className="latest-blocks-wrapper">
          <div className="latest-block-title">
            <p>
              <span className="title">Latest Blocks</span>
              
            </p>
          </div>
          <div className="blocks-wrapper">
            <LatestBlocks />
          </div>
        </div> */}
      </>
    );
  }
}

export default withTranslation()(Dashboard);
