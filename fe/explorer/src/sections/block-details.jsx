import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import cx from 'classnames';

import { blocksService } from 'common/services/block';
import LinkButton from "common/components/link-button";
import NotExist from 'common/components/not-exist';
import { BlockStatus, TxnTypeText, TxnClasses } from 'common/constants';
import { date, hash, prevBlock } from 'common/helpers/blocks';
import { formatCoin, priceCoin } from 'common/helpers/utils';
import { priceService } from 'common/services/price';
import { withTranslation } from "react-i18next";

class BlocksExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      block: null,
      totalBlocksNumber: undefined,
      errorType: null,
      price: {}
    };
  }
  componentWillUpdate(nextProps) {
    if (nextProps.params.blockHeight !== this.props.params.blockHeight) {
      this.getOneBlockByHeight(nextProps.params.blockHeight);
    }
  }
  componentDidMount() {
    const { blockHeight } = this.props.params;
    this.getOneBlockByHeight(blockHeight);
    this.getPrices();
  }
  getOneBlockByHeight(height) {
    const { totalBlocksNumber } = this.state;
    const msg = this.props.location.state;
    if (Number(height)
      && (totalBlocksNumber === undefined
        || totalBlocksNumber >= height
        || height > 0)) {
      blocksService.getBlockByHeight(height)
        .then(res => {
          switch (res.data.type) {
            case 'block':
              this.setState({
                block: res.data.body,
                totalBlocksNumber: res.data.totalBlocksNumber,
                errorType: null
              });
              break;
            case 'error_not_found':
              this.setState({
                errorType: msg ? 'error_coming_soon' : 'error_not_found'
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
  renderNoMoreMsg() {
    return (
      <div className="th-explorer__buttons--no-more">No More</div>
    )
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
      if (!price.SCPT) {
        this.getPrices();
      }
    }, 1000);
  }
  render() {
    const { block, totalBlocksNumber, errorType, price } = this.state;
    const {t} = this.props;
    const height = Number(this.props.params.blockHeight);
    const hasNext = totalBlocksNumber > height;
    const hasPrev = height > 1;
    const isCheckPoint = block && (block.total_voted_guardian_stakes != undefined);
    return (
      <div className="content block-details">
        <div className="page-title blocks">Block Details</div>
        {errorType === 'error_not_found' &&
          <NotExist />}
        {errorType === 'error_coming_soon' &&
          <NotExist msg="This block information is coming soon." />}
        {block && !errorType &&
          <React.Fragment>
            <table className="txn-info details">
              <tbody className={cx({ 'cp': isCheckPoint })}>
                <tr>
                  <th>{t(`height`)}</th>
                  <td>{height}</td>
                </tr>
                <tr>
                  <th>{t(`status`)}</th>
                  <td>{BlockStatus[block.status]}</td>
                </tr>
                <tr>
                  <th>{t(`timestamp`)}</th>
                  <td>{date(block)}</td>
                </tr>
                <tr>
                  <th>{t(`hash`)}</th>
                  <td>{hash(block)}</td>
                </tr>
                <tr>
                  <th># {t(`transactions`)}</th>
                  <td>{block.num_txs}</td>
                </tr>
                {isCheckPoint && <tr>
                  <th className="cp"># {t(`votes_ligtning_stakes`)}</th>
                  <td>
                    <div className="currency scptwei left">{formatCoin(block.total_voted_guardian_stakes)} {t(`scpt`)}</div>
                    <div className='price'>&nbsp;{`[\$${priceCoin(block.total_voted_guardian_stakes, price['scpt'])} USD]`}</div>
                  </td>
                </tr>}
                {isCheckPoint && <tr>
                  <th className="cp"># {t(`depostied_lightning_stakes`)}</th>
                  <td>
                    <div className="currency scptwei left">{formatCoin(block.total_deposited_guardian_stakes)} {t(`scpt`)}</div>
                    <div className='price'>&nbsp;{`[\$${priceCoin(block.total_deposited_guardian_stakes, price['scpt'])} USD]`}</div>
                  </td>
                </tr>}
                <tr>
                  <th>{t(`proposer`)}</th>
                  <td>{<Link to={`/account/${block.proposer}`}>{block.proposer}</Link>}</td>
                </tr>
                <tr>
                  <th>{t(`state_hash`)}</th>
                  <td>{block.state_hash}</td>
                </tr>
                <tr>
                  <th>{t(`txns_hash`)}</th>
                  <td>{block.transactions_hash}</td>
                </tr>
                <tr>
                  <th>{t(`previous_block`)}</th>
                  <td>{<Link to={`/blocks/${height - 1}`}>{prevBlock(block)}</Link>}</td>
                </tr>
              </tbody>
            </table>

            <h3>{t(`transactions`)}</h3>
            <table className="data transactions">
              <tbody>
                {_.map(block.txs, (t, i) => <Transaction key={i} txn={t} />)}
              </tbody>
            </table>

            <div className="button-list split">
              {hasPrev &&
                <Link className="btn icon prev" to={`/blocks/${height - 1}`}><i /></Link>}
              {hasNext &&
                <Link className="btn icon next" to={`/blocks/${height + 1}`}><i /></Link>}
            </div>
          </React.Fragment>}
      </div>);
  }
}

const Transaction = ({ txn }) => {
  let { hash, type } = txn;
  return (
    <tr className="block-txn">
      <td className={cx("txn-type", TxnClasses[type])}>{TxnTypeText[type]}</td>
      <td className="hash overflow"><Link to={`/txs/${hash}`}>{hash}</Link></td>
    </tr>)
}

export default withTranslation() (BlocksExplorer);

