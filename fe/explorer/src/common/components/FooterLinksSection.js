import React from "react";
import { Link } from "react-router-dom";

const FooterLinksSection = ({ title, links = [] }) => {
  return (
    <div className="">
      <h4 className="text-base xl:text-lg uppercase font-bold mb-4">{title}</h4>

      <div className="space-y-3">
        {links &&
          links.map(
            ({ title, to = "/", target = "_self", anchorTag = false }, i) =>
              anchorTag ? (
                <a
                  key={i}
                  href={to}
                  target={target}
                  className="block text-xs xl:text-sm cursor-pointer w-fit"
                >
                  {title}
                </a>
              ) : (
                <a
                  key={i}
                  href={to}
                  target={target}
                  className="block text-xs xl:text-sm cursor-pointer w-fit"
                >
                  {title}
                </a>
              )
          )}
      </div>
    </div>
  );
};

export default FooterLinksSection;
