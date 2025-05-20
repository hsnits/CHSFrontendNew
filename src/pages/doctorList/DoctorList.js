import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import user_img from "../../assets/img/dr_profile.jpg";
import { Award, Clock, Heart, MapPin } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "../../redux/slices/doctorApi";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { createAppointment } from "../../redux/slices/patientApi";
import { cpFirstName, formatName } from "../../helpers/utils";
import { toastMessage } from "../../config/toast";

function DoctorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [backupDoctorsList, setBackupDoctorsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [availability, setAvailability] = useState(null); // true, false, or null
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const allDoctorsList = useSelector(
    (state) => state.DOCTOR?.data?.user?.getDoctorsResult
  );

  const apLoading = useSelector(
    (state) => state.DOCTOR?.loading?.user?.createAppointmentLoading
  );
  const userProfileId = getLocalStorage(STORAGE.USER_KEY);
  const allLanguages = Array.from(
    new Set(
      backupDoctorsList.flatMap((doc) => doc.profile?.languages || [])
    )
  );

  useEffect(() => {
    dispatch(getDoctors());
  }, []);

  const handleBookAppointment = async (data) => {
    // console.log(userProfileId,"userProfileId")
    if (userProfileId?.role?.toLowerCase() == "doctor") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to create an appointment."
      );
      return;
    }
    const formattedData = {
      refDoctor: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled")
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
      navigate(`/doctorbooking/${res?.payload?._id}`);
    });
  };

  useEffect(() => {
if(allDoctorsList?.length>0){
  setBackupDoctorsList(allDoctorsList);
  setDoctorsList(allDoctorsList);
}    
  }, [allDoctorsList]);

  useEffect(() => {
    let filtered = [...backupDoctorsList];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((doc) => {
        const profile = doc.profile || {};
        return (
          (profile.firstName && profile.firstName.toLowerCase().includes(term)) ||
          (profile.lastName && profile.lastName.toLowerCase().includes(term)) ||
          (profile.displayName && profile.displayName.toLowerCase().includes(term)) ||
          (doc.designation && doc.designation.toLowerCase().includes(term)) ||
          (doc.name && doc.name.toLowerCase().includes(term))
        );
      });
    }

    // Filter by languages
    if (selectedLanguages.length > 0 && isFilterApplied) {
      filtered = filtered.filter((doc) => {
        const profile = doc.profile || {};
        return (
          profile.languages &&
          profile.languages.some((lang) => selectedLanguages.includes(lang))
        );
      });
    }

    // Filter by availability
    if (availability !== null) {
      filtered = filtered.filter((doc) => doc.availability === availability);
    }

    // Sort
    filtered.sort((a, b) => {
      const nameA = (a.profile?.displayName || a.profile?.firstName || a.name || "").toLowerCase();
      const nameB = (b.profile?.displayName || b.profile?.firstName || b.name || "").toLowerCase();
      if (sortOrder === "A-Z") return nameA.localeCompare(nameB);
      if (sortOrder === "Z-A") return nameB.localeCompare(nameA);
      return 0;
    });

    setDoctorsList(filtered);
  }, [searchTerm, availability, sortOrder, backupDoctorsList,isFilterApplied]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setIsFilterApplied(false);
  };

  const handleApplyFilters = () => {
    setIsFilterApplied(true);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLanguages([]);
    setAvailability(null);
    setSortOrder("A-Z");
    setIsFilterApplied(false);
    setDoctorsList(backupDoctorsList);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.checked);
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
                     
                      {/* <div className="doctor-filter-availability mb-4">
                        <p>Availability</p>
                        <div className="status-toggle status-tog">
                          <input
                            type="checkbox"
                            id="status_6"
                            className="check"
                            checked={availability === true}
                            onChange={handleAvailabilityChange}
                          />
                          <label htmlFor="status_6" className="checktoggle">
                            checkbox
                          </label>
                        </div>
                      </div> */}
                      {/* <div className="filter-grid">
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
                      </div> */}

                      <div className="filter-grid">
                        <h4>
                          <a href="#collapseeight" data-bs-toggle="collapse">
                            Languages
                          </a>
                        </h4>
                        <div id="collapseeight" className="collapse show">
                          <div className="filter-collapse">
                            <ul>
                              {allLanguages.map((lang) => (
                                <li key={lang}>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      checked={selectedLanguages.includes(lang)}
                                      onChange={() => handleLanguageChange(lang)}
                                    />
                                    <span className="checkmark"></span>
                                    {lang}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="filter-btn apply-btn">
                        <div className="row">
                          <div className="col-6">
                            <button 
                              className="btn btn-primary"
                              onClick={handleApplyFilters}
                            >
                              Apply
                            </button>
                          </div>
                          <div className="col-6">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={handleResetFilters}
                            >
                              Reset
                            </button>
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
                          <div className="search-filter">
                            <div className="input-group">
                              <span className="input-group-text">
                              <i className="fas fa-search"></i> 
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search doctors by name, specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                          </div>
                          <p className="mt-3 text-center text-gray-500">
                            <span>Total {doctorsList.length} Doctors found</span>
                          </p>
                        </div>
                      </div>
                      <div></div>
                      <div className="doctor-filter-option">
                        <div className="doctor-filter-sort">
                          <p>Sort</p>
                          <div className="doctor-filter-select">
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                              <option value="A-Z">A to Z</option>
                              <option value="Z-A">Z to A</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card doctor-card">
                    {doctorsList.length > 0 ? (
                      doctorsList?.map((el, index) => {
                        const data = el?.profile;
                        return (
                          <div key={index} className="card-body">
                            <div className="doctor-widget-one">
                              <div className="doc-info-left">
                                <div className="doctor-img">
                                  <a href="#">
                                    <img
                                      src={el?.coverImage || user_img}
                                      className="img-fluid"
                                      alt="Doctor Profile"
                                    />
                                  </a>
                                  <div className="favourite-btn">
                                    {/* <a
                                      href="javascript:void(0)"
                                      className="favourite-icon"
                                    >
                                      <Heart size={18} />
                                    </a> */}
                                  </div>
                                </div>
                                <div className="doc-info-cont">
                                  <h4 className="doc-name">
                                    <Link to="/doctorprofile">
                                      {formatName(data)}
                                    </Link>
                                    <i className="fas fa-circle-check"></i>
                                  </h4>
                                  <p className="doc-speciality">
                                    {`${data?.designation || ""}${
                                      data?.achievement
                                        ? `, ${data.achievement}`
                                        : ""
                                    }`}
                                  </p>
                                  <div className="clinic-details">
                                    <p className="doc-location">
                                      <MapPin size={18} />
                                      <span>{/* &nbsp;0.9 */}</span>
                                      {cpFirstName(data?.address)}{" "}
                                      {/* <a href="#">
                                        Get Direction
                                      </a> */}
                                    </p>
                                    <p className="doc-location">
                                      <Award size={18} />{" "}
                                      <span>
                                        {" "}
                                        &nbsp;{data?.experience || 20}
                                      </span>{" "}
                                      Years of Experience
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="doc-info-right">
                                <div className="clini-infos">
                                  <ul>
                                    <li
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <span>
                                        <Clock size={18} />
                                      </span>

                                      <span
                                        className={`available-date ${
                                          data?.availability
                                            ? "available-today"
                                            : "notavailable-today"
                                        }`}
                                      >
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
                                    to={`/doctorprofile?userId=${
                                      el?._id || null
                                    }`}
                                  >
                                    View Details
                                  </Link>
                                  <div
                                    onClick={() => handleBookAppointment(el)}
                                    className="btn btn-primary-light"
                                    aria-disabled={apLoading}
                                  >
                                    Book Online Consultation{" "}
                                    {apLoading && <Spinner size="sm" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="card-body text-center py-5">
                        <div className="no-result-found">
                          <i className="feather-search mb-3" style={{ fontSize: '48px', color: '#ccc' }}></i>
                          <h4 className="text-muted mb-2">No doctors found</h4>
                          <p className="text-muted">Try adjusting your search or filter criteria</p>
                        </div>
                      </div>
                    )}
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
