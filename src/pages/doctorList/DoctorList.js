import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import user_img from "../../assets/img/profile-06.jpg";
import { Award, Clock, Heart, MapPin } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "../../redux/slices/doctorApi";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { createAppointment } from "../../redux/slices/patientApi";

function DoctorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorsList = useSelector(
    (state) => state.DOCTOR?.data?.user?.getDoctorsResult
  );
  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;
  useEffect(() => {
    dispatch(getDoctors());
  }, []);

  const handleBookAppointment = async (data) => {
    const formattedData = {
      refDoctor: data?.profile?._id,
      id: userProfileId,
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled")
        navigate(`/doctorbooking/${res.payload?._id}`);
    });
  };
  return (
    <>
      <Header />
      <Banner />

      <div className="doctor-content content">
        <Container>
          <Row>
            <Col xl="12" lg="12" className="map-view">
              <Row>
                <Col xl="3" lg="3" className="theiaStickySidebar">
                  <div className="filter-contents">
                    <div className="filter-header">
                      <h4 className="filter-title">Filter</h4>
                    </div>
                    <div className="filter-details">
                      <div className="filter-grid">
                        <h4>
                          <a href="#collapseone" data-bs-toggle="collapse">
                            Gender
                          </a>
                        </h4>
                        <div id="collapseone" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="gender" />
                                  <span className="checkmark"></span>
                                  Male Gender
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="gender" />
                                  <span className="checkmark"></span>
                                  Female Gender
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-grid">
                        <h4>
                          <a href="#collapsefour" data-bs-toggle="collapse">
                            Speciality
                          </a>
                        </h4>
                        <div id="collapsefour" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="speciality" />
                                  <span className="checkmark"></span>
                                  Urology
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="speciality" />
                                  <span className="checkmark"></span>
                                  Ophthalmology
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="speciality" />
                                  <span className="checkmark"></span>
                                  Cardiology
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-grid">
                        <h4>
                          <a href="#collapsefive" data-bs-toggle="collapse">
                            Experience
                          </a>
                        </h4>
                        <div id="collapsefive" className=" collapse show">
                          <div className="filter-collapse">
                            <ul>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="experience" />
                                  <span className="checkmark"></span>
                                  1-5 Years
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="experience" />
                                  <span className="checkmark"></span>
                                  5+ Years
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-grid">
                        <h4>
                          <a href="#collapsesix" data-bs-toggle="collapse">
                            Online Consultation
                          </a>
                        </h4>
                        <div id="collapsesix" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="online" />
                                  <span className="checkmark"></span>
                                  <i className="feather-video online-icon"></i>{" "}
                                  Video Call
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="online" />
                                  <span className="checkmark"></span>
                                  <i className="feather-mic online-icon"></i>{" "}
                                  Audio Call
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="online" />
                                  <span className="checkmark"></span>
                                  <i className="feather-message-square online-icon"></i>{" "}
                                  Chat
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="online" />
                                  <span className="checkmark"></span>
                                  <i className="feather-users online-icon"></i>{" "}
                                  Instant Consulting
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-grid">
                        <h4>
                          <a href="#collapseeight" data-bs-toggle="collapse">
                            Languages
                          </a>
                        </h4>
                        <div id="collapseeight" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="language" />
                                  <span className="checkmark"></span>
                                  English
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="language" />
                                  <span className="checkmark"></span>
                                  French
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="language" />
                                  <span className="checkmark"></span>
                                  Spanish
                                </label>
                              </li>
                              <li>
                                <label className="custom_check d-inline-flex">
                                  <input type="checkbox" name="language" />
                                  <span className="checkmark"></span>
                                  German
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-btn apply-btn">
                        <div className="row">
                          <div className="col-6">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-primary"
                            >
                              Apply
                            </a>
                          </div>
                          <div className="col-6">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-outline-primary"
                            >
                              Reset
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl="9" lg="9">
                  <div className="doctor-filter-info">
                    <div className="doctor-filter-inner">
                      <div>
                        <div className="doctors-found">
                          <p>
                            <span>10 Doctors found for:</span> Dentist in India
                          </p>
                        </div>
                        <div className="doctor-filter-availability">
                          <p>Availability</p>
                          <div className="status-toggle status-tog">
                            <input
                              type="checkbox"
                              id="status_6"
                              className="check"
                            />
                            <label for="status_6" className="checktoggle">
                              checkbox
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="doctor-filter-option">
                        <div className="doctor-filter-sort">
                          <p>Sort</p>
                          <div className="doctor-filter-select">
                            <select className="select">
                              <option>A to Z</option>
                              <option>B to Z</option>
                              <option>C to Z</option>
                              <option>D to Z</option>
                              <option>E to Z</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card doctor-card">
                    <div className="card-body">
                      <div className="doctor-widget-one">
                        {doctorsList?.map((el, index) => {
                          const data = el?.profile;
                          return (
                            <>
                              <div key={index} className="doc-info-left">
                                <div className="doctor-img">
                                  <a href="#">
                                    <img
                                      src={user_img}
                                      className="img-fluid"
                                      alt="John Doe"
                                    />
                                  </a>
                                  <div className="favourite-btn">
                                    <a
                                      href="javascript:void(0)"
                                      className="favourite-icon"
                                    >
                                      <Heart size={18} />
                                    </a>
                                  </div>
                                </div>
                                <div className="doc-info-cont">
                                  <h4 className="doc-name">
                                    <a href="#">Dr.{data?.firstName}</a>
                                    <i className="fas fa-circle-check"></i>
                                  </h4>
                                  <p className="doc-speciality">
                                    {data?.achievement}, {data?.designation}
                                  </p>
                                  <div className="clinic-details">
                                    <p className="doc-location">
                                      <MapPin size={18} />
                                      <span> &nbsp;0.9</span> {data?.address}{" "}
                                      <a href="javascript:void(0);">
                                        Get Direction
                                      </a>
                                    </p>
                                    <p className="doc-location">
                                      <Award size={18} /> <span> &nbsp;20</span>{" "}
                                      Years of Experience
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="doc-info-right">
                                <div className="clini-infos">
                                  <ul>
                                    <li>
                                      <Clock size={18} />
                                      <span className="available-date available-today">
                                        {data?.availability
                                          ? "Available Today"
                                          : "Not available today"}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="clinic-booking book-appoint">
                                  <Link
                                    className="btn btn-primary"
                                    to="/doctorprofile"
                                  >
                                    View Details
                                  </Link>
                                  <div
                                    onClick={() => handleBookAppointment(el)}
                                    className="btn btn-primary-light"
                                  >
                                    Book Online Consultation
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default DoctorList;
