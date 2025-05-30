
import React, { Component, useState } from "react";
export default class GovernanceCard extends Component {
  constructor(props) {
    super(props);
  }
  render({
    governace
  }=this.props){
    return (
        
       <div className="gov-card">
        <h3 className="card-header">Proposed {governace.date}</h3>
        <div className="px-2 py-1">
        <div className="d-flex mb-2">
            <a  className="pills">Voting</a>
            <a className="pills">Voting</a>
        </div>

        <h2>{governace.title}</h2>
        <hr/>
        <div className="d-flex mb-2">
            <label>ID</label>
            <p>{governace.id}</p>
        </div>
        <div className="d-flex mb-2">
            <label>ID</label>
            <p>{governace.id}</p>
        </div>
        <div className="d-flex">
            <label>ID</label>
            <p>{governace.id}</p>
        </div>
        </div>
       </div>
        
    )
  }
}
