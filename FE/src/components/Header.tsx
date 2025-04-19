import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css"; // пока не добавили — можно закомментить

const Header = () => {
  return (
    <nav>
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
        <li>
          <NavLink to="/kontakt">Kontakt</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
