import React from "react";
import FooterLinksSection from "./FooterLinksSection";
import dotool from '../../../dotool';

function Footer({ container = "container-two" }) {
  const footerData = [
    {
      title: "PRODUCTS",
      links: [
        { title: "Script TV", to: dotool.fe_main__URL },
        {
          title: "Script Glass",
          to: dotool.fe_token_URL + "/research",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Developer Hub",
          to: dotool.fe_dev_URL,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "dStorage",
          to: "https://partners.script.tv/#/partner/script",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Script Blockchain",
          to: dotool.fe_token_URL + "/node",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "sADs (Coming Soon)",
          to: dotool.fe_token_URL,
          target: "_blank",
          anchorTag: true,
        },
      ],
    },
    {
      title: "INFORMATION",
      links: [
        {
          title: "Script Network Explained",
          to: dotool.fe_token_URL + "/research",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Script Tokens",
          to: dotool.fe_token_URL + "/token",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Calculator",
          to: `/`,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Run a node",
          to: dotool.fe_token_URL + "/node",
          target: "_blank",
          anchorTag: true,
        },
        // { title: "Technology", to: "/technology" },
        {
          title: "Report Issue",
          to: "/report-issue",
        },
        {
          title: "Download",
          to: dotool.fe_download_URL,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Status",
          to: dotool.fe_status_URL,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "How to buy",
          to:  dotool.fe_presale_URL + "/how-to-buy",
          target: "_blank",
          anchorTag: true,
        },
      ],
    },
    {
      title: "Community",
      links: [
        {
          title: "Discord",
          to: " https://discord.gg/scriptnetwork",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Twitter",
          to: "https://twitter.com/script_network",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Blog",
          to: "https://medium.com/script-network",
          target: "_blank",
          anchorTag: true,
        },
        // {
        //   title: "Facebook",
        //   to: "https://www.facebook.com/scriptnetwork",
        //   target: "_blank",
        //   anchorTag: true,
        // },
        {
          title: "Instagram",
          to: "https://www.instagram.com/script_network/",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Github",
          to: "https://github.com/scriptnetwork",
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Telegram",
          to: "https://t.me/scriptnetworkann",
          target: "_blank",
          anchorTag: true,
        },
      ],
    },
    {
      title: "TERMS",
      links: [
        {
          title: "Terms of Service",
          to: `/terms-and-conditions`,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Privacy Policy",
          to: `/privacy-policy`,
          target: "_blank",
          anchorTag: true,
        },
        {
          title: "Cookies Policy",
          to: `/cookies-policy`,
          target: "_blank",
          anchorTag: true,
        },
      ],
    },
  ];
  // style={{backgroundColor:'red'}}
  return (
    <div className="bg-shade-darkest-blue">
      <div className="py-11">
        <div className={`${container} footer d-flex justify-content-between`}>
          {footerData.map((data, i) => {
            return (
              <FooterLinksSection
                key={i}
                title={data.title}
                links={data.links}
              />
            );
          })}
        </div>
      </div>

      {/* <div className="border-t-2 border-gray">
        <div
          className={`${container} py-6 xl:py-8 flex flex-col sm:flex-row space-y-6 sm:space-y-0 items-center justify-between`}
        >
          <div className="flex items-center space-x-6 sm:space-x-10">
            <img loading="lazy" src="images/logo.svg" className="w-24 xl:w-32" alt="" />

            <a
              href="mailto:contact@script.tv"
              className="text-base xl:text-lg font-medium"
            >
              contact@script.tv
            </a>
          </div>
        </div>

        <p className="text-base xl:text-xl font-medium">
          Copyright © 2022 scripttv
        </p>
      </div> */}
    </div>
  );
}

export default Footer;
