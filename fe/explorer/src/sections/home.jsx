import React, { Component } from "react";
import { Link } from "react-router";
import { blocksService } from "common/services/block";
import TransactionsTable from "common/components/transactions-table";
import BlocksTable from "common/components/blocks-table";
import TokenDashboard from "common/components/token-dashboard";
import { priceService } from "common/services/price";
import { transactionsService } from "common/services/transaction";
import TransactionTable from "common/components/transactions-table";
import BlockOverviewTable1 from "../common/components/blocks-table1";
import TransactionTable1 from "../common/components/transaction-table1";
import FrontBlock from "../sections/front-blocks";
import { tokenService } from "../common/services/token";
import { formatCurrency } from "../common/constants";
import { withTranslation } from "react-i18next";

const MAX_BLOCKS = 15;
const NUM_TRANSACTIONS = 15;
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scptInfo: null,
      spayInfo: null,
      backendAddress: this.props.route.backendAddress,
      blockHeight: 0,
      blockInfoList: [],
      currentPageNumber: 1,
      totalPageNumber: 0,
      transactions: [],
      currentPage: 1,
      totalPages: 0,
      totalSCPTValue: 0,
      totalSPAYValue: 0,
      loading: false,
      price: { SCPT: 0 },
    };
    this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
    this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this);
  }

  componentDidMount() {
    // this.getPrices();
    const { currentPageNumber } = this.state;
    blocksService
      .getBlocksByPage(currentPageNumber, MAX_BLOCKS)
      .then((res) => {
        this.receivedBlocksEvent(res);
      })
      .catch((err) => {
        console.log(err);
      });

    const { currentPage } = this.state;
    this.fetchData(currentPage);
  }

  fetchData(currentPage) {
    this.setState({ loading: true });
    // this.getPrices();
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
    transactionsService
      .getTransactionsByPage(currentPage, NUM_TRANSACTIONS)
      .then((res) => {
        if (res.data.type == "transaction_list") {
          this.setState({
            transactions: _.orderBy(res.data.body, "number", "desc"),
            currentPage: _.toNumber(res.data.currentPageNumber),
            totalPages: _.toNumber(res.data.totalPageNumber),
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }
  receivedBlocksEvent(data) {
    if (data.data.type == "block_list") {
      this.setState({
        blockInfoList: data.data.body,
        currentPageNumber: data.data.currentPageNumber,
        totalPageNumber: data.data.totalPageNumber,
      });
    }
  }

  handleGetBlocksByPage(pageNumber) {
    blocksService
      .getBlocksByPage(pageNumber, MAX_BLOCKS)
      .then((res) => {
        this.receivedBlocksEvent(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getPrices() {
    priceService
      .getAllprices()
      .then((res) => {
        const prices = _.get(res, "data.body");
        prices.forEach((info) => {
          switch (info._id) {
            case "SCPT":
              this.setState({ scptInfo: info });
              return;
            case "SPAY":
              this.setState({ spayInfo: info });
              return;
            default:
              return;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // setTimeout(() => {
    //   let { scptInfo, spayInfo } = this.state;
    //   if (!scptInfo || !spayInfo) {
    //     this.getPrices();
    //   }
    // }, 1000);
  }
  BlocksTable;
  render() {
    const { t } = this.props;
    const {
      scptInfo,
      spayInfo,
      blockInfoList,
      transactions,
      currentPage,
      totalPages,
      loading,
      price,
      totalSCPTValue,
      totalSPAYValue,
    } = this.state;
    const { backendAddress } = this.props.route;
    // console.log(totalSCPTValue, totalSPAYValue);

    return (
      <>
        <div className="container content home home-content-section block-section">
          <div className="row introducing-row">
            <div className="col-md-6 script-network-box">
              <div className="logo-yellow-box">
                <img src="../../images/script-black-logo.png" alt="logo" />
              </div>

              <div className="sectiontwo">
                <div className="sectiontwo-inner">
                  <div className="introducing-tv">
                    {t(`introducing_script_network`)}
                  </div>
                  <div className="welcome-to-script">
                    {t(`welcome_to_governance_and`)}
                  </div>
                  <div className="governance">
                    {t(`staking_for`)}{" "}
                    <span style={{ color: "#ffef00" }}>
                      {t(`script_network`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 sectionthree">
              <div className="sectionthree-inner">
                <div className="calculating">{t(`circulating_supply`)}</div>
                <div className="distributed-value">
                  {formatCurrency(totalSCPTValue)}{" "}
                  <img
                    src="../../images/tokens/scpt.svg"
                    className="distributed"
                    height={35}
                    width={35}
                    alt="social_icon_1"
                  />{" "}
                  <span>1,000,000,000</span>
                </div>
                <div className="progress circulating">
                  <div
                    className="progress-bar circulating"
                    role="progressbar"
                    style={{
                      width: `
                  ${(totalSCPTValue / 1000000000) * 100}%`,
                    }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div style={{ clear: "both" }}></div>
                <div className="calculating-percent">
                  {((totalSCPTValue / 1000000000) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="col-md-3 sectionthree">
              <div className="sectionthree-inner">
                <div className="calculating">{t(`circulating_supply`)}</div>
                <div className="distributed-value">
                  {formatCurrency(totalSPAYValue)}{" "}
                  <img
                    src="../../images/tokens/spay.svg"
                    className="distributed"
                    height={35}
                    width={35}
                    alt="social_icon_1"
                  />{" "}
                  <span>5,000,000,000</span>
                </div>
                <div className="progress circulating">
                  <div
                    className="progress-bar circulating"
                    role="progressbar"
                    style={{ width: `${(totalSPAYValue / 5000000000) * 100}%` }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div style={{ clear: "both" }}></div>
                <div className="calculating-percent">
                  {((totalSPAYValue / 5000000000) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
            {/* <div className="col-md-3 sectionfour">
            <div className="sectionfour-inner">
              <div className="distributed-text">DISTRIBUTED TODAY</div>
              <div className="distributed-value">34,434,553 <img src="../../images/distributed-icon.png" className="distributed" height={35} width={35} alt="social_icon_1"/></div>
            </div>
          </div> */}
          </div>

          <TokenDashboard type="scpt" tokenInfo={scptInfo} />
          {/* <TokenDashboard type='spay' tokenInfo={spayInfo} /> */}
          {/* <FrontBlock/> */}
        </div>
      </>
    );
  }
}

export default withTranslation()(Dashboard);
