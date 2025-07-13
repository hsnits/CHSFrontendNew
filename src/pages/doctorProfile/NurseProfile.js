import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Breadcrumb from "../../components/Breadcrumb";
import user_img from "../../assets/img/dr_profile.jpg";
import { Award, Clock, MapPin, MessageCircle, Phone, Video } from "react-feather";
import { Card, CardBody, Container, Spinner, Tab, Tabs, Modal, Button, Form } from "react-bootstrap";
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

function NurseProfile() {
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

  const userProfileId = getLocalStorage(STORAGE.USER_KEY);

  // Availability details state
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoadingAvail(true);
      fetch(`/nurse/${userId}/availability-details`)
        .then((res) => res.json())
        .then((result) => {
          if (result.status) {
            setAvailabilityDetails(result.data);
          }
        })
        .finally(() => setLoadingAvail(false));
    }
  }, [userId]);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    designation: "",
    phoneNumber: "",
    email: "",
    languages: [],
    address: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        designation: data.profile?.designation || data.designation || "",
        phoneNumber: data.profile?.phoneNumber || data.phoneNumber || "",
        email: data.profile?.email || data.email || "",
        languages: data.profile?.languages || data.languages || [],
        address: data.profile?.address || data.address || "",
      });
    }
  }, [data]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLanguages = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, languages: value.split(",").map((l) => l.trim()) }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      // Call the nurse update API
      const res = await fetch(`/nurse/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          designation: form.designation,
          phoneNumber: form.phoneNumber,
          email: form.email,
          languages: form.languages,
          address: form.address,
        }),
      });
      const result = await res.json();
      if (result.status) {
        toastMessage("success", "Profile updated successfully");
        setShowEdit(false);
        getAllData(`/user/${userId}`);
      } else {
        toastMessage("error", result.message || "Update failed");
      }
    } catch (err) {
      toastMessage("error", "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleBookAppointment = async (data) => {
    if (userProfileId?.role?.toLowerCase() == "doctor") {
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
                      <h4 className="doc-name mb-2">Nurse {data?.name}</h4>
                      <p className="doc-speciality text-muted mb-2">
                        {data?.profile?.designation || data?.designation || "--"}
                      </p>
                      <p className="doc-department d-flex align-items-center gap-2">
                        <img
                          src="assets/img/specialities/specialities-05.png"
                          className="img-fluid"
                          alt=""
                        />
                        {`${data?.profile?.designation || data?.designation || ""}${
                          data?.profile?.achievement || data?.achievement
                            ? `, ${data.profile?.achievement || data.achievement}`
                            : ""
                        }`}
                      </p>

                      <div className="clinic-details">
                        <p className="doc-location d-flex align-items-center gap-2">
                          <MapPin size={18} />
                          {cpFirstName(data?.profile?.address || data?.address)}
                        </p>
                        <p className="doc-location d-flex align-items-center gap-2">
                          <span>Phone: {data?.profile?.phoneNumber || data?.phoneNumber || "--"}</span>
                        </p>
                        <p className="doc-location d-flex align-items-center gap-2">
                          <span>Email: {data?.profile?.email || data?.email || "--"}</span>
                        </p>
                        <p className="doc-location d-flex align-items-center gap-2">
                          <span>Languages: {(data?.profile?.languages || data?.languages || []).join(", ")}</span>
                        </p>
                      </div>
                      <div className="clinic-services">
                        <span className="d-flex align-items-center gap-2">
                          <Award size={18} />
                          {data?.experience || 20} Years of Experience
                        </span>
                      </div>
                      <Button variant="outline-primary" className="mt-3" onClick={() => setShowEdit(true)}>
                        Edit Profile
                      </Button>
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
                          <span>{cpFirstName(data?.profile?.address || data?.address)}</span>
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
                          {/* You can customize this section for nurse details */}
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
                                    American Nursing University
                                  </a>
                                  <div>B.Sc Nursing</div>
                                  <span class="time">2010 - 2014</span>
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
                                    City Hospital
                                  </a>
                                  <span class="time">2015 - Present</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="locations" title="Locations / Business Hours">
                  <div className="p-3">
                    {loadingAvail ? (
                      <Spinner />
                    ) : availabilityDetails ? (
                      <div className="nurse-availability-details">
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1a73e8' }}>
                          {availabilityDetails.wardName || 'General Ward'}
                        </div>
                        <div style={{ color: '#888', marginBottom: 8 }}>
                          Floor: {availabilityDetails.floor || '2'}
                        </div>
                        <div style={{ fontWeight: 'bold', float: 'right', fontSize: '1.3rem' }}>
                          ${availabilityDetails.price || 0}
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        <div style={{ marginTop: 16 }}>
                          {availabilityDetails.weeklySchedule && Object.keys(availabilityDetails.weeklySchedule).length > 0 ? (
                            <>
                              {Object.entries(availabilityDetails.weeklySchedule).map(([day, times]) => (
                                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <div style={{ fontWeight: 500 }}>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                                  <div>
                                    {times.morning && (
                                      <span>{times.morning} </span>
                                    )}
                                    {times.evening && (
                                      <span>{times.morning ? ' / ' : ''}{times.evening}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div>No schedule set.</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>No availability details found.</div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Container>
      </div>
      <Footer />

      {/* Edit Profile Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Nurse Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control name="designation" value={form.designation} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phoneNumber" value={form.phoneNumber} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={form.email} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Languages (comma separated)</Form.Label>
              <Form.Control name="languages" value={form.languages.join(", ")} onChange={handleEditLanguages} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={form.address} onChange={handleEditChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editLoading}>
              {editLoading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default NurseProfile; 