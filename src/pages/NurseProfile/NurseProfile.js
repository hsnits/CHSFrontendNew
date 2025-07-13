import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import user_img from '../../assets/img/profile-06.jpg';
import { Award, Clock, MapPin, MessageCircle, Phone, Video } from "react-feather";
import { Card, CardBody, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { toastMessage } from "../../config/toast";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../../redux/slices/patientApi";

function NurseProfile() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apLoading = useSelector(
    (state) => state.DOCTOR?.loading?.user?.createAppointmentLoading
  );

  const { data, getAllData } = useGetMountData(userId ? `/user/${userId}` : null);

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() === "doctor") {
      toastMessage(
        "error",
        "You are not a patient user, so you are not eligible to create an appointment."
      );
      return;
    }
    const formattedData = {
      refNurse: data?.profile?._id,
      id: userProfileId?.profile?._id,
      status: "Created",
    };
    dispatch(createAppointment(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled")
        setLocalStorage(STORAGE.APPOINTMENT_KEY, {
          appointment_id: res?.payload?._id,
        });
      navigate(`/nursebooking/${res?.payload?._id}`);
    });
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <Breadcrumb />
      <div className="content">
        <Container>
          <Card>
            <CardBody>
              {typeof data === "object" && (data?.fileKey?.length > 0 || data?.coverImage) && (
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
                      <h4 className="doc-name mb-2">Nurse {data?.name}</h4>
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
                          {data?.profile?.address}
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
                          <span>{data?.profile?.address}</span>
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
                        to="/bookappointment"
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
            <CardBody className="pt-0">
              <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="home" title="Overview">
                  <div className="row">
                    <div className="col-md-12 col-lg-9">
                      <div className="widget about-widget">
                        <h4 className="widget-title">About Me</h4>
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

                      <div className="widget education-widget">
                        <h4 className="widget-title">Education</h4>
                        <div className="experience-box">
                          <ul className="experience-list">
                            <li>
                              <div className="experience-user">
                                <div className="before-circle"></div>
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">
                                    American Nursing University
                                  </a>
                                  <div>B.Sc Nursing</div>
                                  <span className="time">2010 - 2014</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="widget experience-widget">
                        <h4 className="widget-title">Work & Experience</h4>
                        <div className="experience-box">
                          <ul className="experience-list">
                            <li>
                              <div className="experience-user">
                                <div className="before-circle"></div>
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <a href="#/" className="name">
                                    City Hospital
                                  </a>
                                  <span className="time">2015 - Present</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                {/* Add more tabs as needed */}
              </Tabs>
            </CardBody>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default NurseProfile;
