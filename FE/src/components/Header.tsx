import React from "react";
import { NavLink } from "react-router-dom";
import "./../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <img src="/logo.svg" alt="Logo" />
        </div>

        <div className="header-main-right">
          <div className="header-right">
            <div className="header-contacts">
              <p>0174 345 44 19</p>
              <p>tonn_andreas@web.de</p>
              <p>Sessendrupweg 54</p>
              <p>48161 Münster</p>
            </div>
          </div>
      

        <div className="header-nav">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/wertermittlung">Wertermittlung</NavLink>
            </li>
            <li>
              <NavLink to="/immobilien">Immobilien</NavLink>
            </li>
            <li>
              <NavLink to="/finanzierung">Finanzierung</NavLink>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
