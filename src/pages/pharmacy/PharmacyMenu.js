import React from "react";
import "../pharmacy/Pharmacy.css";
import browsecategory_icon from "../../assets/img/icons/browse-categorie.svg";
import logo_img from "../../assets/img/chs_logo.png";
import { Link } from "react-router-dom";

export default function PharmacyMenu() {
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg header-nav">
            <div className="navbar-header d-md-none d-block">
              <a id="mobile_btn" href="javascript:void(0);">
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </a>
              <a href="/" className="navbar-brand logo">
                <img src={logo_img} className="img-fluid" alt="Logo" />
              </a>
            </div>
            <div className="browse-categorie">
              <div className="dropdown categorie-dropdown">
                <Link to="/">{`< Back`} </Link>
              </div>
            </div>
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <a href="/" className="menu-logo">
                  <img src={logo_img} className="img-fluid" alt="Logo" />
                </a>
                <a
                  id="menu_close"
                  className="menu-close"
                  href="javascript:void(0);"
                >
                  <i className="fas fa-times"></i>
                </a>
              </div>
              <ul className="main-nav">
                <li className="has-submenu megamenu">
                  <Link to="/">Home </Link>
                </li>
                <li className="has-submenu">
                  <Link to="/doctorlist">Doctors </Link>
                </li>
                <li className="has-submenu">
                  <Link to={"/career"}>Career </Link>
                </li>
                <li className="has-submenu">
                  <Link to={"/contact"}>Contact </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
