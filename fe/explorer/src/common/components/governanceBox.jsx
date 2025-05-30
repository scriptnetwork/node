
import React, { Component, useState } from "react";
export default class GovernanceBox extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      
        <div className="p-3 d-flex gov-box flex-column justify-content-between align-items-center">
            <h3 className="text-center">
                {this.props.val}
            </h3>
            <p className="text-muted">{this.props.label}</p>
        </div>
        
    )
  }
}
