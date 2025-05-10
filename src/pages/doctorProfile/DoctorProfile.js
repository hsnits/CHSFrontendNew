import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import user_img from "../../assets/img/dr_profile.jpg";
import { Award, Clock, MapPin, MessageCircle, Phone, Video } from "react-feather";
import { Card, CardBody, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useGetMountData from "../../helpers/getDataHook";
import { isObject } from "formik";
import { cpFirstName } from "../../helpers/utils";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../../redux/slices/patientApi";

function DoctorProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apLoading = useSelector(
    (state) => state.DOCTOR?.loading?.user?.createAppointmentLoading
  );

  const { data, getAllData } = useGetMountData(
    userId ? `/user/${userId}` : null
  );

  // useEffect(() => {
  //   if (userId) {
  //     getAllData(`/user/${userId}`);
  //   }
  // }, [userId]);
  console.log(data, userId, "data======");

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

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

  return (
    <>
      <Header />
      <Breadcrumb />
      <div class="content">
        <Container>
          <Card>
          <CardBody>
              {typeof data === "object" && data?.fileKey?.length > 0 && (
                <div className="doctor-widget">
                  <div className="doc-info-left">
                    <div className="doctor-img">
                      <img
                        src={data?.coverImage || user_img}
                        className="img-fluid rounded"
                        alt="User Image"
                      />
                    </div>
                    <div className="doc-info-cont">
                      <h4 className="doc-name mb-2">Dr. {data?.name}</h4>
                      <p className="doc-speciality text-muted mb-2">
                        {data?.profile?.designation || "--"}
                      </p>
                      <p className="doc-department d-flex align-items-center gap-2">
                        <img
                          src="assets/img/specialities/specialities-05.png"
                          className="img-fluid"
                          alt=""
                        />
                        {`${data?.profile?.designation || ""}${
                          data?.profile?.achievement
                            ? `, ${data.profile?.achievement}`
                            : ""
                        }`}
                      </p>

                      <div className="clinic-details">
                        <p className="doc-location d-flex align-items-center gap-2">
                          <MapPin size={18} />
                          {cpFirstName(data?.profile?.address)}
                        </p>
                      </div>
                      <div className="clinic-services">
                        <span className="d-flex align-items-center gap-2">
                          <Award size={18} />
                          {data?.experience || 20} Years of Experience
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="doc-info-right">
                    <div className="clini-infos">
                      <ul className="list-unstyled">
                        <li className="d-flex align-items-center gap-2">
                          <MessageCircle size={18} />
                          <span>35 Feedback</span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <MapPin size={18} />
                          <span>{cpFirstName(data?.profile?.address)}</span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <Clock size={18} />
                          <span>100 per hour</span>
                        </li>
                      </ul>
                    </div>
                    <div className="doctor-action d-flex gap-2">
                      <Link to="#" className="btn btn-light">
                        <MessageCircle size={18} />
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-light"
                        data-bs-toggle="modal"
                        data-bs-target="#voice_call"
                      >
                        <Phone size={18} />
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-light"
                        data-bs-toggle="modal"
                        data-bs-target="#video_call"
                      >
                        <Video size={18} />
                      </Link>
                    </div>
                    <div className="clinic-booking mt-3">
                      <Link
                        className="btn btn-primary w-100"
                        to="/doctorList"
                        onClick={() => handleBookAppointment(data)}
                        aria-disabled={apLoading}
                      >
                        {apLoading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Booking...
                          </>
                        ) : (
                          "Book Appointment"
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody class="pt-0">
              <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="home" title="Overview">
                  <div class="row">
                    <div class="col-md-12 col-lg-9">
                      <div class="widget about-widget">
                        <h4 class="widget-title">About Me</h4>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.
                        </p>
                      </div>

                      <div class="widget education-widget">
                        <h4 class="widget-title">Education</h4>
                        <div class="experience-box">
                          <ul class="experience-list">
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">
                                    American Dental Medical University
                                  </a>
                                  <div>BDS</div>
                                  <span class="time">1998 - 2003</span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">
                                    American Dental Medical University
                                  </a>
                                  <div>MDS</div>
                                  <span class="time">2003 - 2005</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div class="widget experience-widget">
                        <h4 class="widget-title">Work & Experience</h4>
                        <div class="experience-box">
                          <ul class="experience-list">
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">
                                    Glowing Smiles Family Dental Clinic
                                  </a>
                                  <span class="time">
                                    2010 - Present (5 years)
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">
                                    Comfort Care Dental Clinic
                                  </a>
                                  <span class="time">
                                    2007 - 2010 (3 years)
                                  </span>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <a href="#/" class="name">
                                    Dream Smile Dental Practice
                                  </a>
                                  <span class="time">
                                    2005 - 2007 (2 years)
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div class="widget awards-widget">
                        <h4 class="widget-title">Awards</h4>
                        <div class="experience-box">
                          <ul class="experience-list">
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <p class="exp-year">July 2023</p>
                                  <h4 class="exp-title">Humanitarian Award</h4>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Proin a ipsum tellus.
                                    Interdum et malesuada fames ac ante ipsum
                                    primis in faucibus.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <p class="exp-year">March 2011</p>
                                  <h4 class="exp-title">
                                    Certificate for International Volunteer
                                    Service
                                  </h4>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Proin a ipsum tellus.
                                    Interdum et malesuada fames ac ante ipsum
                                    primis in faucibus.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="experience-user">
                                <div class="before-circle"></div>
                              </div>
                              <div class="experience-content">
                                <div class="timeline-content">
                                  <p class="exp-year">May 2008</p>
                                  <h4 class="exp-title">
                                    The Dental Professional of The Year Award
                                  </h4>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Proin a ipsum tellus.
                                    Interdum et malesuada fames ac ante ipsum
                                    primis in faucibus.
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div class="service-list">
                        <h4>Services</h4>
                        <ul class="clearfix">
                          <li>Tooth cleaning </li>
                          <li>Root Canal Therapy</li>
                          <li>Implants</li>
                          <li>Composite Bonding</li>
                          <li>Fissure Sealants</li>
                          <li>Surgical Extractions</li>
                        </ul>
                      </div>

                      <div class="service-list">
                        <h4>Specializations</h4>
                        <ul class="clearfix">
                          <li>Children Care</li>
                          <li>Dental Care</li>
                          <li>Oral and Maxillofacial Surgery </li>
                          <li>Orthodontist</li>
                          <li>Periodontist</li>
                          <li>Prosthodontics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="profile" title="Locations">
                  <div class="location-list">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="clinic-content">
                          <h4 class="clinic-name">
                            <a href="#">Smile Cute Dental Care Center</a>
                          </h4>
                          <p class="doc-speciality">
                            MDS - Periodontology and Oral Implantology, BDS
                          </p>
                          <div class="clinic-details mb-0">
                            <h5 class="clinic-direction">
                              {" "}
                              <i class="fas fa-map-marker-alt"></i> 2286 Sundown
                              Lane, Austin, Texas 78749, USA <br />
                              <a href="#">Get Directions</a>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <div class="clinic-timing">
                          <div>
                            <p class="timings-days">
                              <span> Mon - Sat </span>
                            </p>
                            <p class="timings-times">
                              <span>10:00 AM - 2:00 PM</span>
                              <span>4:00 PM - 9:00 PM</span>
                            </p>
                          </div>
                          <div>
                            <p class="timings-days">
                              <span>Sun</span>
                            </p>
                            <p class="timings-times">
                              <span>10:00 AM - 2:00 PM</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-2">
                        <div class="consult-price">$250</div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="longer-tab" title="Business Hours">
                  <div class="row">
                    <div class="col-md-6 offset-md-3">
                      <div class="widget business-widget">
                        <div class="widget-content">
                          <div class="listing-hours">
                            <div class="listing-day current">
                              <div class="day">
                                Today <span>5 Nov 2023</span>
                              </div>
                              <div class="time-items">
                                <span class="open-status">
                                  <span class="badge bg-success-light">
                                    Open Now
                                  </span>
                                </span>
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Monday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Tuesday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Wednesday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Thursday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Friday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day">
                              <div class="day">Saturday</div>
                              <div class="time-items">
                                <span class="time">07:00 AM - 09:00 PM</span>
                              </div>
                            </div>
                            <div class="listing-day closed">
                              <div class="day">Sunday</div>
                              <div class="time-items">
                                <span class="time">
                                  <span class="badge bg-danger-light">
                                    Closed
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default DoctorProfile;
