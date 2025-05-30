import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router";
import dotool from '../../../dotool';

const navLinks = [
  {
    icon: "/images/menu/blocks.svg",
    title: "Blocks",
    path: "/blocks",
    type: "internal",
  },
  {
    icon: "/images/icons/icon_transactions@2x.png",
    title: "Transactions",
    path: "/txs",
    type: "internal",
  },
  {
    icon: "/images/menu/coins.svg",
    title: "Tokens",
    path: "/tokens",
    type: "internal",
  },
  {
    icon: "/images/menu/overview.svg",
    title: "Staking",
    path: "/stakes",
    type: "internal",
   },
  //{
  //   icon: "/images/menu/overview.svg",
  //   title: "Governance",
  //   path: "/governance",
  //   type: "internal",
  // }
  {
    icon: "/images/menu/overview.svg",
    title: "FAQ",
    path: dotool.fe_token_URL + "/faq",
    type: "external",
  },
  {
    icon: "/images/menu/wallet.svg",
    title: "Wallet",
    path: dotool.fe_wallet__URL,
    type: "external",
  },
  {
    icon: "/images/menu/more.svg",
    title: "More",
    path: dotool.fe_token_URL + "/",
    type: "external",
  },
];

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.closeSideNav = this.closeSideNav.bind(this);
  }

  closeSideNav() {
    const overlaySideNav = document.getElementById("overlay-sidenav");
    overlaySideNav.style.display = "none";
  }

  render() {
    const { t } = this.props;
    const { tooltipOpen } = this.state;
    const pathname = window.location.pathname;
   
    return (
      <>
        <div className="sidenav-container">
          <div className="logo-wrapper">
          
            <ul>
              <li>
              <div className={`link-wrapper ${pathname=="/"?'active-link':''}`} >
            <Link href="/" className="">
              {/* <img style={{width:'90px'}} src="/images/logo-black.png" alt="" /> */}
              <p className="">Overview</p>
            </Link>
            </div>
                {navLinks.map((link, index) =>
                  link.type === "external" ? (
                    <div className="link-wrapper" key={index}>
                      <a target="_blank" href={link.path}>
                      <p>{link.title}</p>
                      </a>
                      {/* <p>{link.title}</p>
                      <div className="tooltipBox">{link.title}</div> */}
                    </div>
                  ) : (
                    <div className={`link-wrapper ${pathname==link.path?'active-link':''}` } key={index}>
                      <Link href={link.path}>
                        {/* <img src={link.icon} alt="" /> */}
                        <p>{link.title}</p>
                      </Link>
                     
                      {/* <div className="">{link.title}</div> */}
                    </div>
                  )
                )}
                 <div className="get_started">
                  <h3>  Onboard onto Script instantly</h3>
                  <div className="d-flex">  <a href={dotool.fe_main__URL}>Get Started </a>
                  <svg width="20px" height="20px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fill-opacity="0.01"></rect> <path d="M19 11H37V29" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.5441 36.4559L36.9999 11" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  </div>
          </div>
              </li>
            </ul>
          </div>
         
        </div>

        {/* for small devices  */}
        <div className="overlay-sidenav-container" id="overlay-sidenav">
          <div className="logo-wrapper">
            <Link href="/" onClick={this.closeSideNav}>
              <img src="/images/logo.svg" alt="" />
            </Link>
            <div className="cross-icon" onClick={this.closeSideNav}>
              <img src="/images/cross-icon.png" alt="" />
            </div>
          </div>
          <ul className="links-wrapper">
            {navLinks.map((link, index) => (
              <>
                <li key={index} onClick={this.closeSideNav}>
                  <Link href={link.path}>
                    <div className="link-wrapper">
                      <img src={link.icon} className={link.class} alt="" />
                    </div>
                    <p>{link.title}</p>
                  </Link>
                </li>
              </>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default withTranslation()(SideNav);
