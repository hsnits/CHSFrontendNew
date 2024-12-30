import React, { useState } from "react";
import { Button, Col, Form, Modal, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import user_img from "../../assets/img/profile-06.jpg";
import { useSelector } from "react-redux";

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

const Dashboard = ({ data, appointmentData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [record, setRecord] = useState({
    name: "",
    date: "",
    description: "",
  }); 

  const handleTabClick = (tab, event) => {
    event.preventDefault();
    setActiveTab(tab);
  };
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };
  const handleFileChange = (e) => {
    setRecord({ ...record, file: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Medical Record:", record);
    // Handle form submission logic, e.g., API call
    setShowModal(false);
  };

  const renderButton = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <button
            onClick={() => navigate("/doctorlist")}
            className="btn btn-primary"
          >
            Book Appointment
          </button>
        );
      case "medicalRecords":
        return (
          <button onClick={handleModalShow} className="btn btn-secondary">

            Add Medical Record
          </button>
        );
      case "prescriptions":
        return (
          <button
            onClick={() => console.log("Prescription")}
            className="btn btn-success"
          >
            Request Prescription
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <Tab.Pane eventKey="first">
      <div className="dashboard-header">
        <h3>Dashboard</h3>
      </div>

      <Col lg="12" xl="12" className="d-flex">
        <div className="dashboard-card w-100">
          <div className="dashboard-card-head">
            <div className="header-title">
              <h5>Reports</h5>
            </div>
            <a href="javascript:void(0);">
              <img
                src={data?.coverImage ?? user_img}
                className="avatar dropdown-avatar"
                alt="Img"
              />
              &nbsp; &nbsp;{data?.profile?.firstName}
            </a>
          </div>
          <div className="dashboard-card-body">
            <div className="account-detail-table">
              <nav className=" relative patient-dash-tab border-0 pb-0 mb-3 mt-3">
                <ul className="nav nav-tabs-bottom" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "appointments" ? "active" : ""
                      }`}
                      href="#appoint-tab"
                      onClick={(event) => handleTabClick("appointments", event)}
                    >
                      Appointments
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "medicalRecords" ? "active" : ""
                      }`}
                      href="#medical-tab"
                      onClick={(event) =>
                        handleTabClick("medicalRecords", event)
                      }
                    >
                      Medical Records
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTab === "prescriptions" ? "active" : ""
                      }`}
                      href="#prsc-tab"
                      onClick={(event) =>
                        handleTabClick("prescriptions", event)
                      }
                    >
                      Prescriptions
                    </a>
                  </li>
                  <div className="d-flex absolute top-0 right-0">
                    {renderButton()}
                  </div>
                </ul>
              </nav>

              {/* Conditional rendering of tab content */}
              <div className="tab-content pt-0">
                {activeTab === "appointments" && (
                  <div
                    id="appoint-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-new-table">
                      <div className="table-responsive">
                        <table className="table table-hover table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Test Name</th>
                              <th>Date</th>
                              <th>Referred By</th>
                              <th>Amount</th>
                              <th>Comments</th>
                              <th>Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          {appointmentData?.map((el, index) => {
                            return (
                              <tbody key={index}>
                                <tr>
                                  <td>
                                    <a href="javascript:void(0);">
                                      <span className="text-blue">
                                        RE-{el?._id.slice(-3)}
                                      </span>
                                    </a>
                                  </td>
                                  <td>Electro cardiography</td>
                                  <td>{formatDate(el?.date)}</td>
                                  <td>Edalin Hendry</td>
                                  <td>$300</td>
                                  <td>Good take rest</td>
                                  <td>
                                    <span className="badge badge-success-bg">
                                      Normal
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <a
                                        href="#"
                                        className="account-action me-2"
                                      >
                                        <i className="fa-solid fa-prescription"></i>
                                      </a>
                                      <a href="#" className="account-action">
                                        <i className="fa-solid fa-file-invoice-dollar"></i>
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "medicalRecords" && (
                  <div
                    id="medical-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-blue-600">
                                <a href="javascript:void(0);">#MR-123</a>
                              </td>
                              <td>
                                <a
                                  href="javascript:void(0);"
                                  className="lab-icon"
                                >
                                  <span>
                                    <i className="fa-solid fa-paperclip"></i>
                                  </span>
                                  Lab Report
                                </a>
                              </td>
                              <td>24 Mar 2024</td>
                              <td>Glucose Test V12</td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-download"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "prescriptions" && (
                  <div
                    id="prsc-tab"
                    className="tab-pane fade show active"
                    role="tabpanel"
                  >
                    <div className="custom-table">
                      <div className="table-responsive">
                        <table className="table table-center mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Created Date</th>
                              <th>Prescribed By</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-blue-600">
                                <a
                                  href="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#view_prescription"
                                >
                                  #PR-123
                                </a>
                              </td>
                              <td>
                                <a
                                  href="javascript:void(0);"
                                  className="lab-icon prescription"
                                >
                                  <span>
                                    <i className="fa-solid fa-prescription"></i>
                                  </span>
                                  Prescription
                                </a>
                              </td>
                              <td>24 Mar 2024, 10:30 AM</td>
                              <td>
                                <h2 className="table-avatar">
                                  <a href="#" className="avatar avatar-sm me-2">
                                    <img
                                      className="avatar-img rounded-3"
                                      src={user_img}
                                      alt="User Image"
                                    />
                                  </a>
                                  <a href="#">Edalin Hendry</a>
                                </h2>
                              </td>
                              <td>
                                <div className="action-item">
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-download"></i>
                                  </a>
                                  <a href="javascript:void(0);">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Tab.Pane>
     {/* Modal for adding medical record */}
     <Modal show={showModal} onHide={handleModalClose}>
     <Modal.Header closeButton>
       <Modal.Title>Add Medical Record</Modal.Title>
     </Modal.Header>
     <Form onSubmit={handleFormSubmit}>
       <Modal.Body>
         <Form.Group className="mb-3" controlId="formRecordName">
           <Form.Label>Name</Form.Label>
           <Form.Control
             type="text"
             placeholder="Enter record name"
             name="name"
             value={record.name}
             onChange={handleInputChange}
             required
           />
         </Form.Group>
         <Form.Group className="mb-3" controlId="formRecordDate">
           <Form.Label>Date</Form.Label>
           <Form.Control
             type="date"
             name="date"
             value={record.date}
             onChange={handleInputChange}
             required
           />
         </Form.Group>
         <Form.Group className="mb-3" controlId="formRecordDescription">
           <Form.Label>Description</Form.Label>
           <Form.Control
             as="textarea"
             rows={3}
             name="description"
             value={record.description}
             onChange={handleInputChange}
             placeholder="Enter description"
           />
         </Form.Group>
         <Form.Group className="mb-3" controlId="formFile">
            <Form.Label>Attach File</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={handleFileChange}
            />
          </Form.Group>
       </Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={handleModalClose}>
           Close
         </Button>
         <Button variant="primary" type="submit">
           Save Record
         </Button>
       </Modal.Footer>
     </Form>
   </Modal>
   </>
  );
};

export default Dashboard;
