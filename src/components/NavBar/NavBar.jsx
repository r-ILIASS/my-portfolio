import React from "react";
import "./navBar.scss";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="navContent">
        <h3>Web Developper</h3>
        <ul>
          <li>About</li>
          <li>Skills</li>
          <li>Projects</li>
          <li>Contatct</li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
