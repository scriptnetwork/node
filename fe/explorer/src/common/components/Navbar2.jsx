import React, { Component } from 'react';
import { browserHistory, Link } from "react-router";
import { HiOutlineMenu } from "react-icons/hi";
import dotool from '../../../dotool';

const navLinks = [
  {
    id: 1,
    path: '/blocks',
    title: 'Blocks',
    type: 'internal',
  },
  {
    id: 2,
    path: '/txs',
    title: 'Transaction',
    type: 'internal',
  },
  {
    id: 3,
    path: '/tokens',
    title: 'Tokens',
    type: 'internal',
  },
  {
    id: 4,
    path: '/stakes',
    title: 'Staking',
    type: 'internal',
  },
  {
    id: 5,
    path: dotool.fe_wallet__URL,
    title: 'Wallet',
    type: 'external',
  },
//  {
//    id: 6,
//    path: 'https://nodemonitor.script.tv/',
//    title: 'Node Monitor',
//    type: 'external',
//  },
];

export default class Navbar2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
   
    this.showSideNav = this.showSideNav.bind(this);
    this.closeSideNav = this.closeSideNav.bind(this);
  }

  closeSideNav() {
    const overlaySideNav = document.getElementById("overlay-sidenav");
    overlaySideNav.style.display = "none";
  }

  showSideNav() {
    console.log("show")
    const overlaySideNav = document.getElementById("overlay-sidenav");
    console.log("sidenav",overlaySideNav);
    overlaySideNav.style.display = "inherit";
  }

  render() {
    const { t } = this.props;
    const pathname = window.location.pathname;
    // console.log("path====>", pathname);

    return (
      <div className='outer-Navbar'>

        <div className="logo-wrapper2">
          <Link to="/">
            <img src="/images/logo.svg" alt="Logo" />
          </Link>
        </div>

        {/* large screen --start */}

        <div className='nav-text'>
          {navLinks.map((link, index) =>
            link.type === "external" ? (
              <div className="nav-item" key={index}>
                <a target="_blank" href={link.path} className="nav-item">
                  <p>{link.title}</p>
                </a>
              </div>
            ) : (
              <div className={`${pathname == link.path ? 'nav-item active' : 'nav-item'}`} key={index}>
                <Link to={link.path} className="nav-item">
                  <p>{link.title}</p>
                </Link>
              </div>
            )
          )}
        </div>
          
          {/* small screen  --start*/}

        <div className="menu-icon" onClick={this.showSideNav}>
             <HiOutlineMenu  size='30'/>
        </div>

        <div id="overlay-sidenav" className="overlay-sidenav">
          <div className="sidenav-content">
            <span className="closebtn" onClick={this.closeSideNav}>&times;</span>
            {navLinks.map((link, index) =>
              link.type === "external" ? (
                <a key={index} target="_blank" href={link.path}  onClick={this.closeSideNav} className="sidenav-item">
                  {link.title}
                </a>
              ) : (
                <Link key={index} to={link.path} className="sidenav-item"  onClick={this.closeSideNav}>
                  {link.title}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}
