import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { browserHistory, Link } from "react-router";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.searchInput = React.createRef();
    this.showSideNav = this.showSideNav.bind(this);
  }

  handleEnterKey(e) {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  }

  handleSearch() {
    const value = this.searchInput.value;
    if (value !== "") {
      if (value.trim().startsWith("0x")) {
        if (value.trim().length === 42) {
          browserHistory.push(`/account/${value}`);
        }
        if (value.trim().length === 66) {
          browserHistory.push(`/txs/${value}`);
        }
      } else {
        browserHistory.push(`/blocks/${value}`);
      }
      this.searchInput.value = "";
    }
    this.props.toggleLayout();
  }

  showSideNav() {
    const overlaySideNav = document.getElementById("overlay-sidenav");
    overlaySideNav.style.display = "inherit";
  }

  render() {
    const { t } = this.props;
    return (
      <>
        <div className="navbar-container">
          <div className="logo-wrapper">
            <Link href="/">
              <img src="/images/logo.svg" alt="" />
            </Link>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="address / block height / tx hash"
              onKeyPress={(e) => this.handleEnterKey(e)}
              ref={(input) => (this.searchInput = input)}
            />
            <div className="menu-wrapper" onClick={this.showSideNav}>
              <img src="/images/menu/menu-icon.png" alt="" />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(NavBar);
