import React, { Component } from "react";
import { Link } from "react-router";
import { browserHistory } from 'react-router';
import cx from 'classnames';
import { withTranslation } from "react-i18next";
import { ReadSmartContractToken } from "./read-smart-contract-token";

class SmartContractTokenTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      blockHeight: 0,
      tokens: []
    };
    this.onSocketEvent = this.onSocketEvent.bind(this);
  }
  static defaultProps = {
    includeDetails: true,
    truncate: 35,
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tokens && nextProps.tokens.length && nextProps.tokens !== prevState.tokens) {
      return { tokens: nextProps.tokens };
    }
    return prevState;
  }
  componentDidMount() {
    const { backendAddress } = this.state;
    const { updateLive } = this.props;

    // Initial the socket
    // if(updateLive && backendAddress) {
    //   this.socket = socketClient(backendAddress);
    //   this.socket.on('PUSH_TOP_BLOCKS', this.onSocketEvent)
    // }
  }
  componentWillUnmount() {
    if (this.socket)
      this.socket.disconnect();
  }
  onSocketEvent(data) {
    if (data.type == 'block_list') {
      this.setState({ tokens: data.body })
    }
  }

  handleRowClick = (height) => {
    browserHistory.push(`/blocks/${height}`);
  }

  render() {
    const { className, includeDetails, truncate, t } = this.props;
    const { tokens } = this.state;
    return (
      <table className={cx("data block-table", className)}>
        <thead>
          <tr>
            <th className="height">Token</th>
            <th className="hash">Address</th>
            <th className="hash">Circulating Market Cap</th>
            <th className="hash">Total Supply</th>
          </tr>
        </thead>
        <tbody>
          {tokens
            .map((b, i) => {
              return (
                b.name ? (<tr key={i}>
                  <td className="height">{b.name}</td>
                  <td className="hash overflow"><Link to={`/account/${b.address}`}>{b.address}</Link></td>
                  <td className="height">N/A</td>
                  <td className="txns">
                    {
                      b.abi.map((a, i) => a.name === 'totalSupply' ? (
                        (<ReadSmartContractToken functionData={a} address={b.address} index={i+1} abi={b.abi}>
                          {JSON.stringify(a)}
                        </ReadSmartContractToken>)
                      ) : null)
                    }
                  </td>
                </tr>) : null                
              );
            })}
        </tbody>
      </table>);
  }
}

export default withTranslation() (SmartContractTokenTable)