import React, { useState } from 'react';
import ChsLogo from '../assets/img/chs_logo.png';
import { Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '../Data';
import patient_img from '../assets/img/icons/patient.png';
import doctor_img from '../assets/img/icons/doctor.png';
import pharmacy_img from '../assets/img/icons/pharmacy.png';
import ambulance_img from '../assets/img/icons/ambulance.png';
import diagnosis_img from '../assets/img/icons/diagnosis.png';
import pathology_img from '../assets/img/icons/pathology_img.png';
import nursing_img from '../assets/img/icons/nursing.png';
import biomedical_img from '../assets/img/icons/biomedical.png';
import hospital_img from '../assets/img/icons/hospital.png';


function Header() {
	const location = useLocation();
	const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);

	const toggleSubmenu = () => {
		setIsSubmenuVisible(!isSubmenuVisible);
	};

	return (
		<header className="header header-trans header-two">
			<Container>
				<Nav className="navbar navbar-expand-lg header-nav">
					<div className="navbar-header">
						<Link id="mobile_btn" to="javascript:void(0);">
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
					<div className="main-menu-wrapper">
						<div className="menu-header">
							<Link to="/" className="menu-logo">
								<img src={ChsLogo} className="img-fluid" alt="Logo" />
							</Link>
							<Link id="menu_close" className="menu-close" to="javascript:void(0);">
								<i className="fas fa-times"></i>
							</Link>
						</div>
						<ul className="main-nav">
							{Navbar.map(({ menu_name, path, submenu }, nav_item) => (
								<li className={`${location.pathname === path ? 'active' : ''} ${submenu ? 'has-submenu' : ''}`} key={nav_item}>
									{submenu ? (
										<>
											<a href="javascript:void(0);" onClick={toggleSubmenu}>
												{menu_name} <i className="fas fa-chevron-down"></i>
											</a>
											<ul className={`submenu ${isSubmenuVisible ? 'show' : ''}`}>
												{submenu.map((subItem, subIndex) => (
													<li key={subIndex}>
														<Link to={subItem.path}>{subItem.menu_name}</Link>
													</li>
												))}
											</ul>
										</>
									) : (
										<Link to={path}>{menu_name}</Link>
									)}
								</li>
							))}

							<li class="has-submenu megamenu">
								<a href="javascript:void(0);">Register Now <i class="fas fa-chevron-down"></i></a>
								<ul class="submenu mega-submenu">
									<li>
										<div class="megamenu-wrapper">
											<div class="row">
												<div class="col-lg-2">
													<div class="single-demo active">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Patient</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={patient_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Doctor</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={doctor_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Pharmacy Retailers</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={pharmacy_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Pathology</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={pathology_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Diagnosis</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={diagnosis_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Ambulance</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={ambulance_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Nursing</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={nursing_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Biomedical</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={biomedical_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
												<div class="col-lg-2">
													<div class="single-demo">
														<div class="demo-info mb-2">
															<a href="#" class="inner-demo-img">Hospital</a>
														</div>
														<div class="demo-img">
															<a href="#" class="inner-demo-img"><img src={hospital_img} class="img-fluid " alt="img" /></a>
														</div>
														<div class="demo-info">
															<Link className="btn btn-primary text-white" to="/DoctorRegister">Register</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>



							<li className="login-link">
								<Link to="/Login">Login</Link>
							</li>
						</ul>

					</div>
					<ul className="nav header-navbar-rht">
						<li className="nav-item">
							<Link className="nav-link header-login" to='/Login'>login</Link>
						</li>
					</ul>
				</Nav>
			</Container>
		</header>
	)
}

export default Header;