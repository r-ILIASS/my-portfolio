import React from "react";
import TerminalWindow from "../Terminal/Terminal";
import arrow from "../../assets/ArrowDown.svg";
import "./header.scss";

const Header = () => {
  return (
    <div className="header">
      <div className="headerContainer">
        <div className="contentContainer">
          <h3>Scroll Down To Know More About Me</h3>
          <img src={arrow} alt="" />
          <h2>Or, use this cool terminal if you like keyboards</h2>
          <div className="terminal">
            <TerminalWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
