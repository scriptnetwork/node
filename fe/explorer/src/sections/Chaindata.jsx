import React, { Component } from "react";
import TotalDataContext from "../contexts/TotalDataContext";
import { formatCurrency } from "../common/helpers/utils";

export const initialCardData = [
  {
    id: 1,
    text1: "Circulating Supply (SCPT)",
    text2: "N/A",
    text3: "Price",
    text4: "0",
  },
  {
    id: 2,
    text1: "Circulating Supply (SPAY)",
    text2: "N/A",
    text3: "Price",
    text4: "N/A",
  },
  {
    id: 3,
    text1: "Lightning Staked (SCPT)",
    text2: "N/A",
    text3: "Block Time",
    text4: "N/A Sec",
  },
  {
    id: 4,
    text1: "Validators",
    text2: "N/A",
    text3: "Total Nodes",
    text4: "N/A",
  },
];
export default class Chaindata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSCPTValue: 0,
      totalSPAYValue: 0,
      currentPage: 1,
      loading: false,
      cardData: initialCardData,
      totalLightningNode: 0,
      totalValidatorNode: 0,
      totalValidators: 0,
      totalLightning: 0,
      totalEdge: 0,
      contextUpdated: false,
    };
  }

  static contextType = TotalDataContext;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.context !== this.context && !this.state.contextUpdated) {
      const {
        scpt: { totalWeiValue: totalSCPTValue, price: scptPrice },
        spay: { totalWeiValue: totalSPAYValue, price: spayPrice },
        nodes: { num_ln: totalLightningNode, num_vn: totalValidatorNode },
        blockTime,
      } = this.context;

      const totalNodes = totalLightningNode + totalValidatorNode;

      this.setState({
        totalSCPTValue: totalSCPTValue,
        totalSPAYValue: totalSPAYValue,
        totalLightningNode,
        totalValidatorNode,
        cardData: initialCardData.map((card) => {
          const updates = {
            1: {
              text2: totalSCPTValue,
              text4: `$${scptPrice}`,
            },
            2: {
              text2: totalSPAYValue,
              text4: `$${spayPrice}`,
            },
            3: { text2: totalLightningNode, text4: `${blockTime / 1000} Sec` },
            4: { text2: totalValidatorNode, text4: totalNodes },
          };

          return updates[card.id] ? { ...card, ...updates[card.id] } : card;
        }),
        contextUpdated: true,
      });
    }
  }

  render() {
    const { cardData } = this.state;

    return (
      <div className="chain-data-box">
        {cardData.map((item) => {
          return (
            <div key={item?.id} className="card">
              <div className="title-one">{item?.text1}</div>
              <div className="title-two">{item?.text2}</div>

              <div className="title-one">{item?.text3}</div>
              <div className="title-two">{item?.text4}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
