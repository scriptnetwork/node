import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import _ from "lodash";
import cx from "classnames";

import { formatCoin, sumCoin, priceCoin } from "common/helpers/utils";
import { hash } from "common/helpers/transactions";
import { TxnTypeText, TxnClasses } from "common/constants";
import { withTranslation } from "react-i18next";
const TRUNC = 2;

class StakeTxsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      type: this.props.type,
      transactions: this.props.txs.slice(0, TRUNC),
      isSliced: true,
    };
    this.getStakeType = this.getStakeType.bind(this);
  }
  static defaultProps = {
    includeDetails: true,
    truncate: window.screen.width <= 560 ? 10 : 35,
  };
  componentWillUpdate(nextProps) {
    if (nextProps.txs !== this.props.txs) {
      this.setState({
        transactions: nextProps.txs.slice(0, TRUNC),
        isSliced: true,
      });
    }
  }
  toggleList() {
    if (this.state.isSliced) {
      this.setState({ transactions: this.props.txs, isSliced: false });
    } else {
      this.setState({
        transactions: this.props.txs.slice(0, TRUNC),
        isSliced: true,
      });
    }
  }

  getStakeType(type) {
    if (type === "vcp") {
      return "Validator";
    }

    if (type === "gcp") {
      return "Lightning";
    }

    if (type === "eenp") {
      return "Edge";
    }
  }

  render() {
    const { txs, type, className, truncate, price, t } = this.props;
    const { transactions, isSliced } = this.state;
    let sum = txs.reduce((sum, tx) => {
      return sumCoin(sum, tx.amount);
    }, 0);
    let stakeTitle;
    if (type === "source") {
      stakeTitle = (
        <div className="title">
          {t(`tokens_staked_by_this_address_to_validator_lightning_nodes`)}
        </div>
      );
    } else if (type === "holder") {
      stakeTitle = (
        <div className="title">{t(`tokens_staked_to_this_node`)}</div>
      );
    } else if (type === "edgeNode") {
      stakeTitle = (
        <div className="title">{t(`edge_node_staked_to_this_node`)}</div>
      );
    }
    return (
      <div className="stakes">
        {stakeTitle}
        <table className={cx("data txn-table", className)}>
          <thead>
            <tr>
              <th className="node-type">{t(`node_type`)}</th>
              {type === "source" && (
                <th className="token left">{t(`tokens_staked`)}</th>
              )}
              <th className="address">
                {type === "source" ? t(`to_node`) : t(`from_address`)}
              </th>
              {/* <th className="txn">STAKING TX</th> */}
              <th className="status">{t(`status`)}</th>
              {type !== "source" && (
                <th className="token">{t(`tokens_staked`)}</th>
              )}
            </tr>
          </thead>
          <tbody className="stake-tb">
            {_.map(transactions, (record) => {
              const address = type === "holder" ? record.source : record.holder;
              return (
                <tr key={record._id}>
                  <td className={cx("node-type", record.type)}>
                    {this.getStakeType(record.type)}
                  </td>
                  {type === "source" && (
                    <td className="token left">
                      <div className="currency scptwei left">
                        {formatCoin(record.amount)} SCPT
                      </div>
                    </td>
                  )}
                  <td className="address">
                    <Link to={`/account/${address}`}>
                      {_.truncate(address, { length: truncate })}
                    </Link>
                  </td>
                  {/* <td className="txn"><Link to={`/txs/${record.txn}`}>{hash(record, truncate)}</Link></td> */}
                  <td className="status">
                    {record.withdrawn ? "Pending Withdrawal" : "Staked"}
                  </td>
                  {type !== "source" && (
                    <td className="token">
                      <div className="currency scptwei">
                        {formatCoin(record.amount)}{" "}
                        {window.screen.width <= 560 ? "" : "SCPT"}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {txs.length > TRUNC && (
              <tr>
                <td
                  className="arrow-container"
                  colSpan="4"
                  onClick={this.toggleList.bind(this)}
                >
                  {t(`view`)} {isSliced ? "More" : "Less"}
                </td>
              </tr>
            )}
            <tr>
              <td className="empty" colSpan={4}></td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={cx("token", { left: type === "source" })}>
                <div
                  className={cx("currency scptwei", {
                    left: type === "source",
                  })}
                >
                  {formatCoin(sum)} SCPT{" "}
                </div>
                {/* {type === 'source' && <div className='price'>&nbsp;{`[\$${priceCoin(sum, price['Pando'])} USD]`}</div>} */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTranslation()(StakeTxsTable);
