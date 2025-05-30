import React, { Component, useTransition } from "react";
import { browserHistory, Link } from "react-router";
import { withTranslation } from "react-i18next";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTokenSectionVisible: false,
      isServiceSectionVisible: false,
      isCompanySectionVisible: false,
      isPrivacySectionVisible: false,
    };
    this.isTokenSectionVisible = false;
    this.isServiceSectionVisible = false;
    this.isCompanySectionVisible = false;
    this.isPrivacySectionVisible = false;
    this.toggleTokenNav = this.toggleTokenNav.bind(this);
    this.toggleServiceNav = this.toggleServiceNav.bind(this);
    this.toggleCompanyNav = this.toggleCompanyNav.bind(this);
    this.togglePrivacyNav = this.togglePrivacyNav.bind(this);
  }

  toggleTokenNav() {
    this.isTokenSectionVisible = !this.isTokenSectionVisible;
    this.setState({
      isTokenSectionVisible: this.isTokenSectionVisible,
    });
  }

  toggleServiceNav() {
    this.isServiceSectionVisible = !this.isServiceSectionVisible;
    this.setState({
      isServiceSectionVisible: this.isServiceSectionVisible,
    });
  }

  toggleCompanyNav() {
    this.isCompanySectionVisible = !this.isCompanySectionVisible;
    this.setState({
      isCompanySectionVisible: this.isCompanySectionVisible,
    });
  }

  togglePrivacyNav() {
    this.isPrivacySectionVisible = !this.isPrivacySectionVisible;
    this.setState({
      isPrivacySectionVisible: this.isPrivacySectionVisible,
    });
  }

  render() {
    const { t } = this.props;
    const {
      isTokenSectionVisible,
      isServiceSectionVisible,
      isCompanySectionVisible,
      isPrivacySectionVisible,
    } = this.state;
    return (
      <div id="app-content" className="footer-bg">
        <div className="container content footer-content-section">
          <div className="footer-container">
            {/* <div className="col-md-4 footer-section">
                <div className="social-icon-section">
                  <img
                    src="../../images/logo.svg"
                    className="script-tv-footer"
                  />
                  <div className="follow-us">Follow Us on</div>
                  <div className="social-icons">
                    <Link href="#" target="_blank">
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
                    <Link
                      href="https://x.com/script_network"
                      target="_blank"
                    >
                      <img
                        src="../../images/social_icon_3.png"
                        className="social_icon_3"
                        alt="social_icon_3"
                      />
                    </Link>
                    <Link href="https://t.me/+Vu1gbwyoksZORzAG" target="_blank">
                      <img
                        src="../../images/social_icon_4.png"
                        className="social_icon_4"
                        alt="social_icon_4"
                      />
                    </Link>
                    <Link
                      href="https://discord.com/invite/tC26m3cTWu"
                      target="_blank"
                    >
                      <img
                        src="../../images/social_icon_5.png"
                        className="social_icon_5"
                        alt="social_icon_5"
                      />
                    </Link>
                    <Link
                      href="https://www.facebook.com/scriptnetwork"
                      target="_blank"
                    >
                      <img
                        src="../../images/social_icon_6.png"
                        className="social_icon_6"
                        alt="social_icon_6"
                      />
                    </Link>
                    <Link
                      href="https://github.com/scriptnetwork"
                      target="_blank"
                    >
                      <img
                        src="../../images/social_icon_7.png"
                        className="social_icon_7"
                        alt="social_icon_7"
                      />
                    </Link>
                  </div>
                </div>
                <Link href="/" target="_blank" className="join-pre-sale">
                  Join Wishlist
                </Link>
              </div> */}
            <div className="col-md-3 col-sm-6 footer-section footer_web">
              <div className="footer-heading">{t(`token`)}</div>
              <ul>
                <li>
                  <Link
                    href="https://token.script.tv/token"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`scpt_token`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://token.script.tv/token"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`spay_token`)}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 footer-section footer_web">
              <div className="footer-heading">{t(`services`)}</div>
              <ul>
                <li>
                  <Link
                    href="https://token.script.tv/calculator"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`earnings_calculator`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/scriptnetwork"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`github`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://medium.com/script-network"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`medium`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://whitepaper.script.tv/"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`whitepaper`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://status.script.tv/"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`status`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://token.script.tv/how-to-buy"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`how_to_buy`)}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 footer-section footer_web">
              <div className="footer-heading">{t(`company`)}</div>
              <ul>
                <li>
                  <Link href="javascript:void(0);" className="nav-item">
                    {t(`about_us`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://token.script.tv/node"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`run_a_node`)}
                  </Link>
                </li>
                <li>
                  <Link href="javascript:void(0);" className="nav-item">
                    {t(`content_partners`)}
                  </Link>
                </li>
                <li>
                  <Link href="javascript:void(0);" className="nav-item">
                    {t(`contact_us`)}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 footer-section footer_web">
              <div className="footer-heading">{t(`privacy`)}</div>
              <ul>
                <li>
                  <Link
                    href="https://token.script.tv/terms-condition"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`terms_of_service`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://token.script.tv/privacy-policy"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`privacy_policy`)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://token.script.tv/cookies-policy"
                    target="_blank"
                    className="nav-item"
                  >
                    {t(`cookies_policy`)}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer_mobile">
            <section
              className="accordion-section mt-3"
              aria-label="Question Accordions"
            >
              <div className="container">
                <div
                  className="panel-group"
                  id="accordion"
                  role="tablist"
                  aria-multiselectable="true"
                >
                  <div
                    className="panel panel-default footer_cbgft"
                    onClick={this.toggleTokenNav}
                  >
                    <div
                      className="panel-heading p-3 mb-3"
                      role="tab"
                      id="heading0"
                    >
                      <h3 className="panel-title">
                        <a
                          className="collapsed"
                          role="button"
                          title=""
                          data-toggle="collapse"
                          data-parent="#accordion"
                          aria-expanded="true"
                          aria-controls="collapse0"
                        >
                          {t(`token`)} {isTokenSectionVisible}
                        </a>
                      </h3>
                    </div>
                    <div
                      id="collapse0"
                      className={
                        isTokenSectionVisible
                          ? "panel-collapse d-block"
                          : "panel-collapse collapse"
                      }
                      role="tabpanel"
                      aria-labelledby="heading0"
                    >
                      <div className="panel-body px-3 mb-4">
                        <div className="mobile_kcgdr">
                          <ul>
                            <li>
                              <Link
                                href="https://token.script.tv/token/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`scpt_token`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://token.script.tv/token/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`spay_token`)}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="panel panel-default footer_cbgft"
                    onClick={this.toggleServiceNav}
                  >
                    <div
                      className="panel-heading p-3 mb-3"
                      role="tab"
                      id="heading1"
                    >
                      <h3 className="panel-title">
                        <a
                          className="collapsed"
                          role="button"
                          title=""
                          data-toggle="collapse"
                          data-parent="#accordion"
                          aria-expanded="true"
                          aria-controls="collapse1"
                        >
                          {t(`services`)}{" "}
                        </a>
                      </h3>
                    </div>
                    <div
                      id="collapse1"
                      className={
                        isServiceSectionVisible
                          ? "panel-collapse d-block"
                          : "panel-collapse collapse"
                      }
                      role="tabpanel"
                      aria-labelledby="heading1"
                    >
                      <div className="panel-body px-3 mb-4">
                        <div className="mobile_kcgdr">
                          <ul>
                            <li>
                              <Link
                                href="https://token.script.tv/calculator/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`earnings_calculator`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://github.com/scriptnetwork"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`github`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://medium.com/script-network"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`medium`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://whitepaper.script.tv/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`whitepaper`)}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="panel panel-default footer_cbgft"
                    onClick={this.toggleCompanyNav}
                  >
                    <div
                      className="panel-heading p-3 mb-3"
                      role="tab"
                      id="heading2"
                    >
                      <h3 className="panel-title">
                        <a
                          className="collapsed"
                          role="button"
                          title=""
                          data-toggle="collapse"
                          data-parent="#accordion"
                          aria-expanded="true"
                          aria-controls="collapse2"
                        >
                          {t(`company`)}{" "}
                        </a>
                      </h3>
                    </div>

                    <div
                      id="collapse2"
                      className={
                        isCompanySectionVisible
                          ? "panel-collapse d-block"
                          : "panel-collapse collapse"
                      }
                      role="tabpanel"
                      aria-labelledby="heading2"
                    >
                      <div className="panel-body px-3 mb-4">
                        <div className="mobile_kcgdr">
                          <ul>
                            <li>
                              <Link
                                href="https://token.script.tv/aboutus/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`about_us`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://token.script.tv/validator/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`become_a_node`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://token.script.tv/content-partner/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`content_partners`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="mailto:hello@script.tv"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`contact_us`)}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="panel panel-default"
                    onClick={this.togglePrivacyNav}
                  >
                    <div
                      className="panel-heading p-3 mb-3"
                      role="tab"
                      id="heading3"
                    >
                      <h3 className="panel-title">
                        <a
                          className="collapsed"
                          role="button"
                          title=""
                          data-toggle="collapse"
                          data-parent="#accordion"
                          aria-expanded="true"
                          aria-controls="collapse3"
                        >
                          Privacy{" "}
                        </a>
                      </h3>
                    </div>
                    <div
                      id="collapse3"
                      className={
                        isPrivacySectionVisible
                          ? "panel-collapse d-block"
                          : "panel-collapse collapse"
                      }
                      role="tabpanel"
                      aria-labelledby="heading3"
                    >
                      <div className="panel-body px-3 mb-4">
                        <div className="mobile_kcgdr">
                          <ul>
                            <li>
                              <Link
                                href="https://token.script.tv/terms-condition/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`terms_of_service`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://token.script.tv/privacy-policy/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`privacy_policy`)}
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="https://token.script.tv/cookies-policy/"
                                target="_blank"
                                className="nav-item"
                              >
                                {t(`cookies_policy`)}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* <div className="col-md-12 footer-copyright">
          <div className="footer-container-text">&copy; 2022 Script Technologies Ltd. All Rights Reserved</div>            
        </div>  */}
        </div>
      </div>
    );
  }
}

export default withTranslation()(Footer);
