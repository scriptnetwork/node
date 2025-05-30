import React, { Component } from "react";
import { Link } from "react-router";

export default class FrontBlocks extends Component {
  
  render() {
    
    return (     
      <div className="row block-container"> 
          <div className="col-md-12 block-heading-section">
              <img src="../../images/block-icon.png" className="block-icon" height={35} width={35} alt="social_icon_1"/> <span className="block-heading block-title">Proposals</span>
            </div>
            <div className="col-md-12 block-section">
              <div className="col-md-12 block-list">
                <div className="col-md-6 front">
                  <img src="../../images/block-list-icon-1.png" className="block-icon" height={20} width={20} alt="social_icon_1"/> 
                  <Link to="/proposal"><span className="block-text">DIP 5 - Upgrade the StarkProxy smart contract</span></Link>
                </div>
                <div className="col-md-4 middle">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="col-md-2 last"><img src="../../images/block-list-check-1.png" className="block-check" height={15} width={15} alt="block-check"/> <span className="status">Executed</span></div>
              </div>  
              {/* <div className="col-md-12 block-list">
                <div className="col-md-6 front">
                  <img src="../../images/block-list-icon-2.png" className="block-icon" height={20} width={20} alt="social_icon_1"/> 
                  <Link to="/proposal"><span className="block-text">DIP 5 - Upgrade the StarkProxy smart contract</span></Link>
                </div>
                <div className="col-md-4 middle">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="col-md-2 last"><img src="../../images/block-list-check-2.png" className="block-check" height={15} width={15} alt="block-check"/> <span className="status">Executed</span></div>
              </div> */}
              <div className="col-md-12 block-list">
                <div className="col-md-6 front">
                  <img src="../../images/block-list-icon-3.png" className="block-icon" height={20} width={20} alt="social_icon_1"/> 
                  <Link to="/proposal"><span className="block-text">DIP 5 - Upgrade the StarkProxy smart contract</span></Link>
                </div>
                <div className="col-md-4 middle">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="col-md-2 last">
                  <img src="../../images/block-list-check-3.png" className="block-check" height={15} width={15} alt="block-check"/> <span className="status">Executed</span>
                </div>
              </div>
              <div className="col-md-12 block-list">
                <div className="col-md-6 front">
                  <img src="../../images/block-list-icon-4.png" className="block-icon" height={20} width={20} alt="social_icon_1"/>
                  <Link to="/proposal"><span className="block-text">DIP 5 - Upgrade the StarkProxy smart contract</span></Link>
                </div>
                <div className="col-md-4 middle">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="col-md-2 last"><span className="status">Cancelled</span></div>
              </div>
              <div className="col-md-12 block-list">
                <div className="col-md-6 front">
                  <img src="../../images/block-list-icon-5.png" className="block-icon" height={20} width={20} alt="social_icon_1"/> 
                  <Link to="/proposal"><span className="block-text">DIP 5 - Upgrade the StarkProxy smart contract</span></Link>
                </div>
                <div className="col-md-4 middle">
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="col-md-2 last"><img src="../../images/block-list-cross.png" className="block-check" height={15} width={15} alt="block-check"/> <span className="status">Failed</span></div>
              </div>
          </div>
      </div>     
    );
  }
}