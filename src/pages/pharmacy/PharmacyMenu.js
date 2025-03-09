import React from "react";
import "../pharmacy/Pharmacy.css";
import browsecategory_icon from "../../assets/img/icons/browse-categorie.svg";
import logo_img from "../../assets/img/chs_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function PharmacyMenu() {
  const navigate = useNavigate();
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-expand-md header-nav">
            {/* Navbar Header - Visible on Mobile & Medium Screens */}
            <div className="navbar-header d-md-flex d-lg-none justify-content-between align-items-center w-100">
              <a id="mobile_btn" href="#">
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </a>
              <a href="/" className="navbar-brand logo">
                <img src={logo_img} className="img-fluid" alt="Logo" />
              </a>
              <Button
                variant="transparent"
                onClick={() => navigate(-1)}
                className="ms-auto"
              >
                {`<Back`}
              </Button>
            </div>

            {/* Browse Category - Visible on Medium & Large Screens */}
            <div className="browse-categorie d-none d-md-flex d-lg-flex">
              <div className="dropdown categorie-dropdown">
                <Button variant="transparent" onClick={() => navigate(-1)}>
                  {`< Back`}
                </Button>
              </div>
            </div>

            {/* Main Menu */}
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <a href="/" id="menu_close" className="menu-logo">
                  <img src={logo_img} className="img-fluid" alt="Logo" />
                </a>
                <a id="menu_close" className="menu-close" href="#">
                  <i className="fas fa-times"></i>
                </a>
              </div>
              <ul className="main-nav">
                <li className="has-submenu megamenu">
                  <Link to="/" id="menu_close">
                    Home{" "}
                  </Link>
                </li>
                <li className="has-submenu">
                  <Link to="/doctorlist" id="menu_close">
                    Doctors{" "}
                  </Link>
                </li>
                <li className="has-submenu">
                  <Link to={"/career"} id="menu_close">
                    Career{" "}
                  </Link>
                </li>
                <li className="has-submenu">
                  <Link to={"/contact"} id="menu_close">
                    Contact{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
