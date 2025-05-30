import React, { Component } from "react";
import { Link } from "react-router";
export default class Proposal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Link to={`/`}>
              <p className="back-title">
                <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                Back
              </p>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
            <div className="proposal-wrapper">
              <h2>DIP 5 - Upgrade the StarkProxy smart contract</h2>
              <p>
                Launch a Grants Program with $6.25m from the Community Treasury
              </p>
            </div>
          </div>
          <div className="col-md-5 vote-section">
            <div className="status-wrapper">
              <div className="status">
                <p className="status-title">STATUS</p>
                <p className="status-value">
                  <i className="fa fa-check" aria-hidden="true"></i> Executed
                </p>
              </div>
              <div className="vote">
                <p className="vote-title">YOUR VOTE</p>
                <p className="vote-value">-</p>
              </div>
              <div className="vote-btn">
                <button>VOTE</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 vote-for-section">
            <div className="vote-for-wrapper">
              <p>
                <span>Vote For</span>
                <span>
                  34,434,553
                  <img src="../../images/distributed-icon.png" alt="" />
                </span>
              </p>
              <div className="progress circulating">
                <div
                  className="progress-bar circulating"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
          <div className="col-md-6 vote-for-section">
            <div className="vote-for-wrapper">
              <p>
                <span>Voted Against</span>
                <span>
                  0,000,000
                  <img src="../../images/distributed-icon.png" alt="" />
                </span>
              </p>
              <div className="progress circulating">
                <div
                  className="circulating"
                  role="progressbar"
                  style={{ width: "0%" }}
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 proposal-content-section">
            <div className="proposal-content-wrapper">
              <p className="desc-label">DESCRIPTION</p>
              <p className="shapiro-title">Simple Summary</p>
              <p className="content">
                Launch the dYdX Grants Program with $6.25m moved from the
                Community Treasury to the Grants Multi-sig.
              </p>
              <p className="shapiro-title">Abstract</p>
              <p className="content">
                Reverie is proposing to lead a Grants program for the dYdX
                community to engage participants and attract new contributors.
                Grants will include both small and large projects with grantees
                ranging from single individuals to institutional teams. A Grants
                Committee, specified in the DRC, will control the multi-sig and
                advise the lead team on grants. A list of initial RFP ideas has
                been published on the website with the hopes of inspiring future
                contributors. Applicants are encouraged to apply for existing
                RFPs or propose new Grant projects. The lead team will review
                all applications and submit funding proposals to the Committee.
                <br />
                Relevant Links <br />
                DGP website: https://dydxgrants.com/ DRC discussion:
                https://forums.dydx.community/proposal/discussion/2511-drc-dydx-
                grants-program/
              </p>
              <p className="shapiro-title">Motivation</p>
              <p className="content">
                The goal of the program is to increase the contributor count and
                actively promote the growth of the dYdX protocol. While initial
                grants cannot directly change the dYdX product or core
                development, Grantees will have the opportunity to impact growth
                through external tools and non-technical projects (e.g.
                Analytics dashboards, newsletters, governance etc..). This
                contributor growth will lead to improvements across both user
                experiences and the overall community.
              </p>
              <p className="shapiro-title">Specification</p>
              <p className="content">
                Program Design <br />
                <br />
                $3m DYDX Funding per quarter for two quarters 1 Full Time Lead 8
                Committee Members Committee Member held Multi-Sig The treasury
                will move $6.25m worth of DYDX to the Committee Member
                multi-sig. Funds will be used to reward Grantees, pay the Lead
                and cover additional program costs. Grantees will be subject to
                milestones that can determine compensation structure, with
                standard payouts being 25% upfront and the remainder upon
                completion.
                <p className="shapiro-title1">DYDX Amount</p>
                The amount of DYDX to be moved from the community treasury to
                the DGP Multisig will be determined using a 24h vwap of the
                trades executed on the most liquid exchange, namely Binance.com.
                Given it makes up roughly 30% of the 24h volume, the DYDX/USDT
                Binance market data will be used to derive a market price. The
                data will be pulled from
                https://data.binance.vision/?prefix=data/spot/daily/trades/DYDXUSDT/.
                The previous day's trades will be used to capture a full 24h
                window so as to avoid timing constraints. As such, we will use
                the following data set:
                https://data.binance.vision/data/spot/daily/trades/DYDXUSDT/DYDXUSDT-trades-2022-01-01.zip.
                This formula will be used to calculate the price: Σ(Price *
                Volume) / Σ(Volume). From the data above, we find:
                $16,199,143.30 / 1,949,010.42 = $8.31. The DYDX Amount to be
                transferred will be $6,250,000 / $8.31 = 752000.00 (rounded up
                to the nearest thousand for simplicity).
              </p>
              <p className="shapiro-title">Rationale</p>
              <p className="content">
                The community has addressed certain concerns and issues with a
                Grants program in the DRC, but overall consensus has been in
                strong support of launching. The program will make productive
                use of treasury funds to promote the protocol and engage
                contributors. Promoting external tools and analytics dashboards,
                among other projects, will improve the product experience and
                should lead to user growth. The program will also attract third
                party providers and other institutional teams that can build
                bridges and relevant tools to improve governance and trading
                experiences. Grants programs have been successful to grow an
                active contributor base and benefit the underlying protocol. We
                hope to bring this same positive growth to dYdX with this
                program.
              </p>
              <p className="shapiro-title">Copyright</p>
              <p className="content">
                Copyright and related rights waived via CC0.
              </p>
            </div>
          </div>
          <div className="col-md-6 proposal-card-main">
            <div className="row">
              <div className="col-md-6 proposal-card-section">
                <div className="proposal-card">
                  <p className="title">Minimum Quorom</p>
                  <h2>
                    34,434,553
                    <img
                      src="../../images/distributed-icon.png"
                      alt=""
                      className="img-fluid"
                    />
                  </h2>
                  <p className="info">REQUIRED FOR - VOTED TO PASS</p>
                </div>
              </div>
              <div className="col-md-6 proposal-card-section">
                <div className="proposal-card">
                  <p className="title">Minimum Diff</p>
                  <h2>
                    34,434,553
                    <img
                      src="../../images/distributed-icon.png"
                      alt=""
                      className="img-fluid"
                    />
                  </h2>
                  <p className="info">DIFFERENCE IN VOTES TO PASS</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="forum-discord-wrapper">
                  <p className="title">DISCUSS</p>
                  <p className="sub-title">
                    Have thoughts about this proposal? Discuss with others.
                  </p>
                  <div className="btn-wrapper">
                    <a href="" className="for-btn">
                      Forums
                    </a>
                    <a href="" className="dis-btn">
                      Discord
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
