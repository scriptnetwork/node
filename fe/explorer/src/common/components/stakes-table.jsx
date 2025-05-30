import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import cx from "classnames";
import { formatCoin, sumCoin } from "common/helpers/utils";
import { withTranslation } from "react-i18next";

const TRUNC = 20;

class StakesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSliced: true,
      stakeList: this.props.stakes.slice(0, TRUNC),
    };
    this.getStakeType = this.getStakeType.bind(this);
  }
  static defaultProps = {};

  toggleList() {
    if (this.state.isSliced) {
      this.setState({ stakeList: this.props.stakes, isSliced: false });
    } else {
      this.setState({
        stakeList: this.props.stakes.slice(0, TRUNC),
        isSliced: true,
      });
    }
  }
  componentWillUpdate(nextProps) {
    if (nextProps.stakes.length !== this.props.stakes.length) {
      this.setState({
        stakeList: nextProps.stakes.slice(0, TRUNC),
        isSliced: true,
      });
    }
  }

  getStakeType(type) {
    const { t } = this.props;
    if (type === "vcp") {
      return t(`validator`);
    }

    if (type === "gcp") {
      return t(`lightning`);
    }

    if (type === "eenp") {
      return t(`edge`);
    }
  }

  render() {
    const { t } = this.props;
    const { className, type, truncate, totalStaked, stakes } = this.props;
    const { stakeList, isSliced } = this.state;
    let colSpan = type === "node" ? 4 : 3;
    return (
      <div className="stakes half">
        <div className="title">
          {type === "node"
            ? t(`top_validator_lightning_edge_nodes`)
            : t(`top_staking_wallets`)}
        </div>
        <table className={cx("data txn-table", className)}>
          <thead>
            <tr onClick={this.toggleList.bind(this)}>
              <th className="address">{t(`address`)}</th>
              {type === "node" && <th className="node-type">{t(`type`)}</th>}
              <th className="staked newstaked">{t(`tokens_staked`)}</th>
              <th className="staked-prct">%{t(`staked`)}</th>
            </tr>
          </thead>
          <tbody className="stake-tb">
            {_.map(stakeList, (record) => {
              const address = type === "node" ? record.holder : record.source;
              return (
                <tr key={address}>
                  <td className="address">
                    <Link to={`/account/${address}`}>
                      {_.truncate(address, { length: truncate })}
                    </Link>
                  </td>
                  {type === "node" && (
                    <td className={cx("node-type", record.type)}>
                      {this.getStakeType(record.type)}
                    </td>
                  )}
                  <td className="staked">
                    <div className="currency scptwei">
                      {formatCoin(record.amount, 0)}
                    </div>
                  </td>
                  <td className="staked-prct">
                    {((record.amount / totalStaked) * 100).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
            {stakes.length > TRUNC && (
              <tr>
                <td
                  className="arrow-container"
                  colSpan={colSpan}
                  onClick={this.toggleList.bind(this)}
                >
                  View {isSliced ? "More" : "Less"}
                </td>
              </tr>
            )}
            {/* <tr>
              <td className="empty" colSpan={type === "node" ? 4 : 3}></td>
            </tr> */}
            <tr>
              <td></td>
              {type === "node" && <td></td>}
              <td className="staked">
                <div className="currency scptwei">
                  {formatCoin(totalStaked, 0)}
                </div>
              </td>
              <td className="staked-prct">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTranslation()(StakesTable);
