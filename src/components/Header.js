import React, { useState } from "react";
import ChsLogo from "../assets/img/chs_logo.png";
import { Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Data";
import patient_img from "../assets/img/icons/patient.png";
import doctor_img from "../assets/img/icons/doctor.png";
import pharmacy_img from "../assets/img/icons/pharmacy.png";
import ambulance_img from "../assets/img/icons/ambulance.png";
import diagnosis_img from "../assets/img/icons/diagnosis.png";
import pathology_img from "../assets/img/icons/pathology_img.png";
import nursing_img from "../assets/img/icons/nursing.png";
import biomedical_img from "../assets/img/icons/biomedical.png";
import hospital_img from "../assets/img/icons/hospital.png";
import { STORAGE } from "../constants/index";
import { getLocalStorage, removeLocalStorage } from "../helpers/storage";
import { toastMessage } from "../config/toast";
import DrugLicenseModal from "./modals/drug-model";

function Header() {
  const [show, setShow] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(null);
  const isLoggedIn = getLocalStorage(STORAGE.USER_KEY);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);

    // Add or remove class from <html> tag
    if (!isMenuOpen) {
      document.documentElement.classList.add("menu-opened");
    } else {
      document.documentElement.classList.remove("menu-opened");
    }
  };

  const toggleSubmenu = (menu_name) => {
    if (isSubmenuVisible == menu_name) {
      setIsSubmenuVisible(null);
    } else {
      setIsSubmenuVisible(menu_name);
    }
  };

  const handlePharma = (type) => {
    if (type === "Wholesale") {
      setShow(true);
    }
  };

  return (
    <header className="header header-trans header-two">
      <Container>
        <Nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <Link id="mobile_btn" to="#" onClick={toggleMenu}>
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </Link>
            <Link to="/" className="navbar-brand logo">
              <img src={ChsLogo} className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className={`main-menu-wrapper ${isMenuOpen ? "menu-open" : ""}`}>
            <div className="menu-header">
              <Link to="/" className="menu-logo">
                <img src={ChsLogo} className="img-fluid" alt="Logo" />
              </Link>
              <Link id="menu_close" className="menu-close" to="#" onClick={toggleMenu}>
                <i className="fas fa-times"></i>
              </Link>
            </div>
            <ul className="main-nav">
              {isLoggedIn && (
                <li className="has-submenu megamenu d-lg-none">
                  <Link
                    id="menu_close"
                    to={
                      isLoggedIn?.role == "Doctor"
                        ? "/DoctorDashboard"
                        : "/patient"
                    }
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {Navbar.map(({ menu_name, path, submenu }, nav_item) => (
                <li
                  className={`${location.pathname === path ? "active" : ""} ${
                    submenu ? "has-submenu" : ""
                  }`}
                  key={nav_item}
                >
                  {submenu ? (
                    <>
                      <a href="#" onClick={() => toggleSubmenu(menu_name)}>
                        {menu_name} <i className="fas fa-chevron-down"></i>
                      </a>
                      <ul
                        className={`submenu ${
                          isSubmenuVisible == menu_name ? "show" : ""
                        }`}
                      >
                        {submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              id="menu_close"
                              // to={subItem.path}
                              onClick={() => handlePharma(subItem.menu_name)}
                              to={
                                subItem.menu_name === "Wholesale"
                                  ? "#"
                                  : subItem.path
                              }
                            >
                              {subItem.menu_name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link id="menu_close" to={path}>
                      {menu_name}
                    </Link>
                  )}
                </li>
              ))}

              {isLoggedIn && (
                <li className="has-submenu megamenu d-lg-none">
                  <Link
                    id="menu_close"
                    to="/login"
                    onClick={() => {
                      removeLocalStorage(STORAGE.USER_KEY);
                    }}
                  >
                    Logout
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <>
                  {" "}
                  {/* \web menu */}
                  <li className="has-submenu megamenu d-none d-lg-block">
                    <a href="#">
                      Register Now <i className="fas fa-chevron-down"></i>
                    </a>
                    <ul className="submenu mega-submenu">
                      <li>
                        <div className="megamenu-wrapper">
                          <div className="row" id="menu_close">
                            <div className="col-lg-2">
                              <div className="single-demo active">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Patient
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={patient_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Patient"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Doctor
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={doctor_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Doctor"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Pharmacy Retailers
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={pharmacy_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Pharmacy Retailers"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Pathology
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={pathology_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Pathology"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Diagnosis
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={diagnosis_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Diagnosis"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Ambulance
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={ambulance_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Ambulance"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Nursing
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={nursing_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Nursing"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Biomedical
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={biomedical_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Biomedical"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="single-demo">
                                <div className="demo-info mb-2">
                                  <a href="#" className="inner-demo-img">
                                    Hospital
                                  </a>
                                </div>
                                <div className="demo-img">
                                  <a href="#" className="inner-demo-img">
                                    <img
                                      src={hospital_img}
                                      className="img-fluid "
                                      alt="img"
                                    />
                                  </a>
                                </div>
                                <div className="demo-info">
                                  <Link
                                    className="btn btn-primary text-white"
                                    to="/register?key=Hospital"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  {/* \mobile menu */}
                  <li className="has-submenu megamenu d-lg-none">
                    <a href="#" onClick={() => toggleSubmenu("Register")}>
                      Register Now <i className="fas fa-chevron-down"></i>
                    </a>
                    <ul
                      className={`submenu ${
                        isSubmenuVisible == "Register" ? "show" : ""
                      }`}
                    >
                      <li>
                        <div className="megamenu-wrapper">
                          <div className="row" id="menu_close">
                            <Link to="/register?key=Patient">
                              Patient Register
                            </Link>
                            <Link to="/register?key=Doctor">
                              Doctor Register
                            </Link>
                            <Link to="/register?key=Pharmacy Retailers">
                              Pharmacy Retailers Register
                            </Link>
                            <Link to="/register?key=Pathology">
                              Pathology Register
                            </Link>
                            <Link to="/register?key=Diagnosis">
                              Diagnosis Register
                            </Link>
                            <Link to="/register?key=Ambulance">
                              Ambulance Register
                            </Link>
                            <Link to="/register?key=Nursing">
                              Nursing Register
                            </Link>
                            <Link to="/register?key=Biomedical">
                              Biomedical Register
                            </Link>
                            <Link to="/register?key=Hospital">
                              Hospital Register
                            </Link>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  {/* <li className="login" id="menu_close">
                    <Link to="/login">Login</Link>
                  </li> */}
                </>
              )}
            </ul>
          </div>
          <ul className="nav header-navbar-rht  d-lg-flex">
            <li className="nav-item">
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="skyblue"
                    id="dropdown-basic"
                    style={{
                      borderRadius: "50px",
                      backgroundColor: "skyblue",
                      padding: "10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fa-solid fa-user"></i> Account
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={
                        isLoggedIn?.role == "Doctor"
                          ? "/DoctorDashboard"
                          : "/patient"
                      }
                    >
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to={
                        isLoggedIn?.role == "Doctor"
                          ? "/DoctorDashboard?key=sixth"
                          : "/patient?key=fourth"
                      }
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => {
                        removeLocalStorage(STORAGE.USER_KEY);
                        navigate("/login");
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link className="nav-link header-login" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </Nav>
        <DrugLicenseModal show={show} setShow={setShow} />
      </Container>
    </header>
  );
}

export default Header;
