import React, { Component } from "react";
import Footer from "common/components/Footer";
import { RemixService } from "./common/services/remix";
import { soljsonReleases } from "./common/constants";
import Navbar2 from "./common/components/Navbar2";
import dotool from "../dotool";
import { getTotalData } from "./utils/getTotalData";
import TotalDataContext from "./contexts/TotalDataContext";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewDashboard: true,
      currentPath: "/",
      totalData: {},
    };
    this.changePageLayout = this.changePageLayout.bind(this);
    this.getTabName = this.getTabName.bind(this);
  }

  async fetchTotalData() {
    try {
      const totalData = await getTotalData();
      
      this.setState({ totalData });
    } catch (error) {
      console.error("Error fetching total data:", error);
    }
  }

  componentDidMount() {
    const google_tag__URL = dotool.google_tag__URL;
    if (google_tag__URL) {
      const iframe = document.getElementById("customGoogleTagIframe");
      iframe.src = google_tag__URL;
    }
    this.changePageLayout();
    RemixService.getCompilerVersion()
      .then((res) => {
        if (res && res.status === 200) {
          window.soljsonReleases = res.data.releases;
        } else {
          window.soljsonReleases = soljsonReleases;
        }
      })
      .catch((err) => {
        window.soljsonReleases = soljsonReleases;
      });
    this.fetchTotalData();
  }

  changePageLayout() {
    const path = window.location.pathname;
    this.getTabName(path);
    // console.log(path);
    if (path === "/") {
      this.setState({ isNewDashboard: true });
    } else {
      this.setState({ isNewDashboard: false });
    }
  }

  getTabName(path) {
    switch (path) {
      case "/":
        this.setState({
          currentPath: "Overview",
        });
        return;
      case "/stakes":
        this.setState({
          currentPath: "Stakes",
        });
        return;
      case "/tokens":
        this.setState({
          currentPath: "Tokens",
        });
        return;
      case "/txs":
        this.setState({
          currentPath: "Transactions",
        });
        return;
      case "/blocks":
        this.setState({
          currentPath: "Blocks",
        });
        return;
      default:
        if (path.includes("/blocks/")) {
          this.setState({
            currentPath: "Block Detail",
          });
        } else {
          this.setState({
            currentPath: "",
          });
        }
        return;
    }
  }

  render() {
    return (
      <>
        <TotalDataContext.Provider value={this.state.totalData}>
          <div className="new-dashboard-layout">
            <Navbar2 toggleLayout={this.changePageLayout} />

            {this.props.children}
          </div>
          <div className="footer-style-explore">
            <Footer />
          </div>
          <div className="footer-part-2">
            <div id="contact">
              <a
                href="https://contact@script.tv"
                target="_blank"
                className="footer_link"
              >
                contact@script.tv
              </a>
            </div>
            <div>{dotool.system_copyright_line}</div>
          </div>
        </TotalDataContext.Provider>
      </>
    );
  }
}
