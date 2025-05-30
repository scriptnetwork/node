import React, { Component } from "react";
import { browserHistory } from 'react-router';

import { getQueryParam } from 'common/helpers/utils';
import { transactionsService } from 'common/services/transaction';
import { priceService } from 'common/services/price';
import Pagination from "common/components/pagination";
import TransactionTable from "common/components/transactions-table";
import { withTranslation } from "react-i18next";

const NUM_TRANSACTIONS = 50;

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      transactions: [],
      currentPage: 1,
      totalPages: 0,
      loading: false,
      price: { 'SCPT': 0, 'SPAY': 0 }
    };
  }

  componentDidMount() {
    const { currentPage } = this.state;
    this.fetchData(currentPage);
  }

  fetchData(currentPage) {
    this.setState({ loading: true });
    // this.getPrices();
    transactionsService.getTransactionsByPage(currentPage, NUM_TRANSACTIONS)
      .then(res => {
        if (res.data.type == 'transaction_list') {
          this.setState({
            transactions: _.orderBy(res.data.body, 'number', 'desc'),
            currentPage: _.toNumber(res.data.currentPageNumber),
            totalPages: _.toNumber(res.data.totalPageNumber),
            loading: false,
          })
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log(err)
      })
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
  handlePageChange = (pageNumber) => {
    this.fetchData(pageNumber);
  }

  handleRowClick = (hash) => {
    browserHistory.push(`/txs/${hash}`);
  }

  render() {
    const { transactions, currentPage, totalPages, loading, price } = this.state;
    const {t} = this.props;
    return (
      <div className="content transactions">
        <div className="page-title transactions">{t(`transactions`)}</div>
        <TransactionTable transactions={transactions} price={price} />
        <Pagination
          size={'lg'}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
          disabled={loading} />
      </div>
    );
  }
}

export default withTranslation() (Transactions);
