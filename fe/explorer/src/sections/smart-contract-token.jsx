import React, { Component } from "react";
import Pagination from "common/components/pagination";
import { withTranslation } from "react-i18next";
import { smartContractService } from "../common/services/smartContract";
import SmartContractTokenTable from "../common/components/smart-contract-token-table";

const MAX_TOKENS = 50;

class SmartContractToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      blockHeight: 0,
      smartContractTokensList: [],
      currentPageNumber: 1,
      totalPageNumber: 0
    };
    this.receivedBlocksEvent = this.receivedBlocksEvent.bind(this);
    this.handleGetBlocksByPage = this.handleGetBlocksByPage.bind(this);
  }

  componentDidMount() {
    const { currentPageNumber } = this.state;
    smartContractService.getSmartContractTokenList(currentPageNumber, MAX_TOKENS)
      .then(res => {
        this.receivedBlocksEvent(res);
      }).catch(err => {
        console.log(err);
      })
  }

  receivedBlocksEvent(data) {
    if (data.data.type == 'token_txs') {
      this.setState({
        smartContractTokensList: data.data.body,
        currentPageNumber: data.data.currentPageNumber,
        totalPageNumber: data.data.totalPageNumber
      })
    }
  }
  handleGetBlocksByPage(pageNumber) {
    smartContractService.getSmartContractTokenList(pageNumber, MAX_TOKENS)
      .then(res => {
        this.receivedBlocksEvent(res);
      }).catch(err => {
        console.log(err);
      })
  }
  render() {
    const { smartContractTokensList } = this.state;
    const { t } = this.props;
    let { currentPageNumber, totalPageNumber } = this.state;
    currentPageNumber = Number(currentPageNumber);
    totalPageNumber = Number(totalPageNumber);
    return (
      <div className="content blocks">
        <div className="page-title blocks">Tokens</div>
        <SmartContractTokenTable
          tokens={smartContractTokensList}
          truncate={70} />
        <Pagination
          size={'lg'}
          totalPages={totalPageNumber}
          currentPage={currentPageNumber}
          onPageChange={this.handleGetBlocksByPage}
        />
      </div>
    );
  }
}

export default withTranslation() (SmartContractToken)
