import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { formatAddress, copyToClipboard, lang, Languages } from "../constants";
import { withTranslation } from "react-i18next";
// import '../../public/fonts/Poppins-Italic.woff';
// import'../../../public/fonts/Poppins-Italic.woff';

class Header extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.searchType = React.createRef();
    this.languageType = React.createRef();
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.myFunction = this.myFunction.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.toggleWalletSection = this.toggleWalletSection.bind(this);
    this.copyWalletAddress = this.copyWalletAddress.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);
    this.isSearchVisible = false;
    this.isWalletOptionShow = false;
    this.isWalletConnected = false;

    this.state = {
      responsive: false,
      className: "",
      isMobile: false,
      lang: lang,
      languages: Languages,
      selectedLanguage: "English",
    };
  }

  connectWallet() {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        const address = res[0];
        this.setState({
          address,
          isWalletConnected: true,
        });
      });
    } else {
      alert("install metamask extension!!");
    }
  }

  changeLanguage = (lang) => {
    for (const key in this.state.languages) {
      if (key === lang.toLowerCase()) {
        console.log(key, lang);
        this.setState({ selectedLanguage: lang.toLowerCase() });
        this.props.i18n.changeLanguage(this.state.languages[key]);
      }
    }
  };

  myFunction() {
    this.setState(() => ({
      responsive: !this.state.responsive,
      isMobile: !this.state.isMobile,
    }));

    if (this.state.responsive) {
      this.setState({ className: " acgtive" });
    } else {
      this.setState({ className: "" });
    }
  }

  handleLanguage() {
    switch (this.languageType.value) {
      case "english":
        break;
      case "french":
        break;
      case "germans":
        break;
      default:
        break;
    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  toggleWalletSection() {
    this.isWalletOptionShow = !this.isWalletOptionShow;
  }

  disconnectWallet() {
    this.isWalletOptionShow = false;
    this.isWalletConnected = false;
    this.setState({
      isWalletConnected: false,
    });
  }

  copyWalletAddress() {
    copyToClipboard(this.state.address);
  }

  handleSearch() {
    const value = this.searchInput.value;
    switch (this.searchType.value) {
      case "address":
        if (value !== "") {
          browserHistory.push(`/account/${value}`);
          this.searchInput.value = "";
        }
        break;
      case "block":
        browserHistory.push(`/blocks/${value}`);
        this.searchInput.value = "";
        break;
      case "transaction":
        browserHistory.push(`/txs/${value}`);
        this.searchInput.value = "";
        break;
      default:
        break;
    }
  }
  handleEnterKey(e) {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  }

  render() {
    const { t } = this.props;
    const { address, isWalletConnected } = this.state;
    console.log(address, isWalletConnected);
    return (
      <>
        <div className="scpt-header header-section">
          <div id="myTopnav" className="nav" onClick={this.myFunction}>
            <Link href="/" className="scpt-logo" src="/images/logo.svg"></Link>
            <div className="language-select web-drop">
              {/* <select ref={(option) => (this.languageType = option)}>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="spanish">Spanish</option>
              </select> */}
              <select
                onChange={(e) => this.changeLanguage(e.target.value)}
                style={{ border: "none" }}
              >
                {this.state.lang &&
                  this.state.lang.map((val, index) => (
                    <option className="dd-menu" value={val} key={index}>
                      {val}
                    </option>
                  ))}
              </select>
            </div>
            <div className={"margin-left-20 nav " + this.state.className}>
              <Link to="/blocks" className="nav-item">
                {t(`blocks`)}
              </Link>
              <Link to="/txs" className="nav-item">
                {t(`transactions`)}
              </Link>
              <Link to="/stakes" className="nav-item">
                {t(`staking`)}
              </Link>
              <Link
                href="https://wallet.script.tv/"
                target="_blank"
                className="nav-item"
              >
                {t(`create_a_wallet`)}
              </Link>
              <Link
                href="https://token.script.tv/"
                target="_blank"
                className="nav-item"
              >
                {" "}
                {t(`more`)}
              </Link>
            </div>
            <div className="search-icon" onClick={this.toggleSearch}>
              <i className="fa fa-search" aria-hidden="true"></i>
            </div>
            <div className="header-social-icons w-logo">
              <Link href="https://medium.com/script-network" target="_blank">
                <img
                  src="../../images/social_icon_1.png"
                  className="social_icon_1"
                  alt="social_icon_1"
                />
              </Link>
              <Link
                href="https://www.instagram.com/script_network/"
                target="_blank"
              >
                <img
                  src="../../images/social_icon_2.png"
                  className="social_icon_2"
                  alt="social_icon_2"
                />
              </Link>
              <Link href="https://twitter.com/script_network" target="_blank">
                <img
                  src="../../images/social_icon_3.png"
                  className="social_icon_3"
                  alt="social_icon_3"
                />
              </Link>
              <Link href="https://t.me/scriptnetworkann" target="_blank">
                <img
                  src="../../images/social_icon_4.png"
                  className="social_icon_4"
                  alt="social_icon_4"
                />
              </Link>
              <Link href="https://discord.gg/scriptnetwork" target="_blank">
                <img
                  src="../../images/social_icon_5.png"
                  className="social_icon_5"
                  alt="social_icon_5"
                />
              </Link>
              {/* <Link
                href="https://www.facebook.com/scriptnetwork"
                target="_blank"
              >
                <img
                  src="../../images/social_icon_6.png"
                  className="social_icon_6"
                  alt="social_icon_6"
                />
              </Link> */}
              <Link href="https://github.com/scriptnetwork" target="_blank">
                <img
                  src="../../images/social_icon_7.png"
                  className="social_icon_7"
                  alt="social_icon_7"
                />
              </Link>
            </div>

            <div className={"nav-search " + this.state.className}>
              {this.isSearchVisible ? (
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    ref={(input) => (this.searchInput = input)}
                    onKeyPress={(e) => this.handleEnterKey(e)}
                  />
                  {/* <div className="search-button" onClick={this.handleSearch}>
                <svg className="svg-icon" viewBox="0 0 20 20">
                  <path fill="none" d="M19.129,18.164l-4.518-4.52c1.152-1.373,1.852-3.143,1.852-5.077c0-4.361-3.535-7.896-7.896-7.896
                    c-4.361,0-7.896,3.535-7.896,7.896s3.535,7.896,7.896,7.896c1.934,0,3.705-0.698,5.078-1.853l4.52,4.519
                    c0.266,0.268,0.699,0.268,0.965,0C19.396,18.863,19.396,18.431,19.129,18.164z M8.567,15.028c-3.568,0-6.461-2.893-6.461-6.461
                    s2.893-6.461,6.461-6.461c3.568,0,6.46,2.893,6.46,6.461S12.135,15.028,8.567,15.028z"></path>
                </svg>
              </div> */}

                  <div className="search-select">
                    <select ref={(option) => (this.searchType = option)}>
                      <optgroup>
                        <option value="address">{t(`address`)}</option>
                        <option value="block">{t(`block_height`)}</option>
                        <option value="transaction">{t(`transaction`)}</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              ) : null}

              <div className="header-social-icons m-logo">
                <Link href="https://medium.com/script-network" target="_blank">
                  <img
                    src="../../images/social_icon_1.png"
                    className="social_icon_1"
                    alt="social_icon_1"
                  />
                </Link>
                <Link
                  href="https://www.instagram.com/script_network/"
                  target="_blank"
                >
                  <img
                    src="../../images/social_icon_2.png"
                    className="social_icon_2"
                    alt="social_icon_2"
                  />
                </Link>
                <Link href="https://twitter.com/script_network" target="_blank">
                  <img
                    src="../../images/social_icon_3.png"
                    className="social_icon_3"
                    alt="social_icon_3"
                  />
                </Link>
                <Link href="https://t.me/scriptnetworkann" target="_blank">
                  <img
                    src="../../images/social_icon_4.png"
                    className="social_icon_4"
                    alt="social_icon_4"
                  />
                </Link>
                <Link href="https://discord.gg/scriptnetwork" target="_blank">
                  <img
                    src="../../images/social_icon_5.png"
                    className="social_icon_5"
                    alt="social_icon_5"
                  />
                </Link>
                {/* <Link
                  href="https://www.facebook.com/scriptnetwork"
                  target="_blank"
                >
                  <img
                    src="../../images/social_icon_6.png"
                    className="social_icon_6"
                    alt="social_icon_6"
                  />
                </Link> */}
                <Link href="https://github.com/scriptnetwork" target="_blank">
                  <img
                    src="../../images/social_icon_7.png"
                    className="social_icon_7"
                    alt="social_icon_7"
                  />
                </Link>
              </div>
              {/* <div className="language-select mobile_view">
            <select onChange={this.change}>           
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="spanish">Spanish</option>              
            </select>
          </div> */}
              <Link className="connect" style={{ padding: "10px 1vmax" }}>
                {t(`marketplace`)}
              </Link>
              {isWalletConnected ? (
                <Link className="connect" onClick={this.toggleWalletSection}>
                  {formatAddress(address)}
                  {this.isWalletOptionShow ? (
                    <i className="fa fa-caret-up" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                  )}
                </Link>
              ) : (
                <Link
                  className="connect"
                  onClick={this.connectWallet}
                  style={{ padding: "10px 1vmax" }}
                >
                  {" "}
                  {t(`connect_wallet`)}
                </Link>
              )}
              {isWalletConnected && this.isWalletOptionShow ? (
                <div className="wallet-section-wrapper">
                  <ul>
                    <li onClick={this.copyWalletAddress}>
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      {t(`copy_address`)}
                    </li>
                    <li className="text-danger" onClick={this.disconnectWallet}>
                      <i className="fa fa-window-close" aria-hidden="true"></i>
                      {t(`disconnect`)}
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>

            <Link className="icon" onClick={this.myFunction}>
              <i className="fa fa-bars"></i>
            </Link>
          </div>
          {/* <div className="language-select mobile_view">
            <select onChange={this.change}>           
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="spanish">Spanish</option>              
            </select>
          </div> */}
        </div>
      </>
    );
  }
}

export default withTranslation()(Header);
