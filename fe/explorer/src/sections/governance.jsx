import { withTranslation } from "react-i18next";
import React, { Component } from "react";
import GovernanceBox from "../common/components/governanceBox";
import GovernanceCard from "../common/components/governanceCard";


class Governance extends Component {
    constructor(props) {
      super(props);
      this.state={
        governance:{
            id:'294',
            type:'type',
            votingEnds:new Date().toLocaleDateString(),
            title:'Disbursement of OLP rewards for epoch ended on 27 November 2023',
            date:new Date().toLocaleDateString()
        }
      }
    }
    render(){
        return(
        <div className="governance-wrapper">
            <h3>Governance</h3>

            <div className="default-back p-2">
                <div className="d-flex justify-content-between">
                <GovernanceBox val={250} label={'Total Proposals'} key={1}></GovernanceBox>
                <GovernanceBox val={250} label={'Total Proposals'} key={2}></GovernanceBox>
                <GovernanceBox val={250} label={'Total Proposals'} key={3}></GovernanceBox>
                <GovernanceBox val={250} label={'Total Proposals'} key={4}></GovernanceBox>
                </div>
                <hr/>
                <div className="d-flex justify-content-between mb-2">
                <input type="search" className="search-gov" />
                </div>
                <div className="d-flex justify-content-between">
                <GovernanceCard governace={this.state.governance}/>
                <GovernanceCard governace={this.state.governance}/>
                <GovernanceCard governace={this.state.governance}/>
                </div>
            </div>
        </div>
        )
    }
}
export default withTranslation()(Governance)