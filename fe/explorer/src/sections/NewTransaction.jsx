import React, { Component } from 'react';
import { transactionsService } from '../common/services/transaction';
import { hash, age, date, type} from '../common/helpers/transactions';
import { Link } from 'react-router';
import _ from 'lodash';
const data = [
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },  {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },  {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },  {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
    // Add more rows as needed
    {
      blockHash: '0xbfc0fd293de996f444ff1b28b1035a565831...',
      height: 2625328,
      type: 2625328,
      time: 2625328,
    },
  ];
  
const NUM_TRANSACTIONS = 50;

export default class NewTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
        //   backendAddress: this.props.route.backendAddress,
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
     


  render() {

    const { transactions, currentPage, totalPages, loading, price } = this.state;
    const {t} = this.props;
    // console.log("data txs=======>",transactions)
    return (
        <div className='transactions'>
                     
                <div className='transaction-heading'>
                <div>Transactions</div>
                <button><Link to={`/txs`} className='view-all-txs'>View all</Link></button>
                </div>

                <div className='transaction-data-table'>
                
                <table className="custom-table">
                <thead>
                    <tr>
                    <th>Block Hash</th>
                    <th>Height</th>
                    <th>Type</th>
                    <th>TIME</th>
                    </tr> 
                </thead>
                <div className="sticky-border"></div>
                
                <tbody id='txn-overflow'>
                    { transactions.map(txn => {
                     return <tr key={txn.hash}  className='row-txn' >
                        <td id='blockhah'><Link to={`/txs/${txn.hash}`}>{hash(txn, 20)}</Link></td>
                        <td>{txn.block_height}</td>
                        <td>{type(txn)}</td>
                        <td>{age(txn)}</td>
                        
                       </tr>
                        })}
                </tbody>
                </table>
                </div>

       </div>
    )
  }
}
