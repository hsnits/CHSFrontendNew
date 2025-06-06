import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import user_img from "../../assets/img/dr_profile.jpg";
import {
  getDateFormate,
  getIdLastDigits,
  truncateAllText,
  TruncatedText,
} from "../../helpers/utils";
import useGetMountData from "../../helpers/getDataHook";
import NotFound from "../../components/common/notFound";
import { callDeleteApi, callPutApi } from "../../_service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toastMessage } from "../../config/toast";
import { callPostApi } from "../../_service";
import PrescriptionDetailsModal from "../../components/twillio/successpage/PrescriptionDetailsModal";
// import PatientCall from "../../components/twillio/PatientCall";

// Validation schema with Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  file: yup.mixed().required("File is required"),
  // .test("fileSize", "File size is too large", (value) => {
  //   return value && value[0]?.size <= 5 * 1024 * 1024; // 5MB limit
  // }),
});

const Dashboard = ({
  data,
  // appointmentData,
  userProfileId,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isFile, setFile] = useState(null);

  const handleModelShow = () => setShowModal(true);
  const handleModelClose = () => setShowModal(false);

  const handleTabClick = (tab, event) => {
    event.preventDefault();
    setActiveTab(tab);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("en-GB", options);
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // const {
  //   data: isReports,
  //   loading: reportLoading,
  //   getAllData: reportGetData,
  // } = useGetMountData(`/doctor/appointment/${userProfileId}`);

  const {
    data: isReports,
    loading: reportLoading,
    getAllData: reportGetData,
  } = useGetMountData(`/patient/medical/${userProfileId}`);

  const {
    data: appointmentData,
    setData,
    loading,
    getAllData,
  } = useGetMountData(null);

  const handleUpdate = async (id) => {
    try {
      const verifyResponse = await callPutApi(`/patient/prescription/${id}`, {
        prescriptionFile: null,
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      toastMessage("success", "The prescription has been deleted.");
      const updatedData = appointmentData?.filter((item) => item?._id !== id);
      setData(updatedData || []);
    } catch (error) {
      toastMessage("error", "Prescription update process failed!");
    }
  };

  const handleDelete = async (id) => {
    try {
      const verifyResponse = await callDeleteApi(`/patient/medical/${id}`);
      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      toastMessage("success", "The Report has been deleted.");
      reportGetData(`/patient/medical/${userProfileId}`);
    } catch (error) {
      toastMessage("error", "Report delete process failed!");
    }
  };

  useEffect(() => {
    if (data?.profile?._id) {
      getAllData(`/patient/appointment-comp/${data?.profile?._id}`);
    }
  }, [data]);

  // Add file change handler
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setValue("file", file);
    }
  };

  const onSubmit = async (values) => {
    try {
      if (!isFile) {
        toastMessage("error", "Please select a file to upload");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", isFile);

      // Step 1: Upload the file
      const uploadedFile = await callPostApi(`/user/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!uploadedFile.status) throw new Error(uploadedFile.message);

      // Step 2: Prepare the updated data
      const updatedData = {
        name: values.name,
        attachment: uploadedFile?.data?.location || uploadedFile?.data?.file,
        description: values.description,
      };

      // Step 3: Send the data to the API
      const verifyResponse = await callPostApi(
        `/patient/medical/${userProfileId}`,
        updatedData
      );
      if (!verifyResponse.status) throw new Error(verifyResponse.message);

      // Step 4: Notify success and refresh data
      toastMessage("success", "Report is added successfully.");
      reportGetData(`/patient/medical/${userProfileId}`);
      setFile(null); // Reset file state
      setShowModal(false);
    } catch (error) {
      toastMessage("error", error.message || "Report adding process failed!");
    }
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
          <Button
            onClick={handleModelShow}
            className="btn btn-secondary bg-blue-500 text-white"
          >
            Add Medical Record
          </Button>
        );
      // case "prescriptions":
      //   return (
      //     <button
      //       onClick={() => console.log("Prescription")}
      //       className="btn btn-success"
      //     >
      //       Request Prescription
      //     </button>
      //   );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="dashboard-header">
          <h3>Dashboard</h3>
        </div>

        <Col lg="12" xl="12" className="d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Reports</h5>
              </div>
              <a href="#">
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
                        onClick={(event) =>
                          handleTabClick("appointments", event)
                        }
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
                                <th>Name</th>
                                <th>Reason</th>
                                <th>Date</th>
                                <th>Referred By</th>
                                <th>Amount</th>
                                <th>Comments</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            {!loading &&
                              appointmentData?.length > 0 &&
                              appointmentData?.map((el, index) => {
                                return (
                                  <tbody>
                                    <tr key={index}>
                                      <td>
                                        <a href="#">
                                          <span className="text-blue">
                                            <p>
                                              {getIdLastDigits(el?._id, "AP-")}
                                            </p>
                                          </span>
                                        </a>
                                      </td>
                                      <td>
                                        {el?.name ||
                                          el?.testName ||
                                          "Electro cardiography"}
                                      </td>
                                      <td>{el?.reason || "--"}</td>

                                      <td>{getDateFormate(el?.date)}</td>
                                      <td>Dr {el?.refDoctor?.displayName}</td>
                                      <td>${el?.amount || 0}</td>
                                      <td>
                                        {el?.comments || "Good take rest"}
                                      </td>

                                      <td>
                                        {(() => {
                                          const status =
                                            el?.healthStatus?.toLowerCase();
                                          switch (status) {
                                            case "low":
                                              return (
                                                <span className="badge badge-danger-bg">
                                                  Low
                                                </span>
                                              );
                                            case "medium":
                                              return (
                                                <span className="badge badge-warning-bg">
                                                  Medium
                                                </span>
                                              );
                                            case "high":
                                              return (
                                                <span className="badge badge-primary-bg">
                                                  High
                                                </span>
                                              );
                                            case "normal":
                                            default:
                                              return (
                                                <span className="badge badge-success-bg">
                                                  {el?.healthStatus || "Normal"}
                                                </span>
                                              );
                                          }
                                        })()}
                                      </td>
                                      <td>
                                        {/* <div className="d-flex align-items-center">
                                        <a
                                          href="#"
                                          className="account-action me-2"
                                        >
                                          <i className="fa-solid fa-prescription"></i>
                                        </a>
                                        <a href="#" className="account-action">
                                          <i className="fa-solid fa-file-invoice-dollar"></i>
                                        </a>
                                      </div> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                );
                              })}
                          </table>
                          <NotFound
                            loading={loading}
                            isData={appointmentData?.length > 0}
                            message="No completed appointments found."
                          />
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
                            {!reportLoading &&
                              isReports?.length > 0 &&
                              isReports?.map((el, index) => {
                                return (
                                  <tbody>
                                    {console.log(el, "elelel")}
                                    <tr>
                                      <td className="text-blue-600">
                                        <a href="#">
                                          {" "}
                                          <p>
                                            {getIdLastDigits(el?._id, "MR-")}
                                          </p>
                                        </a>
                                      </td>
                                      <td>
                                        {el?.attachment ? (
                                          <a
                                            href={el?.attachment}
                                            className="lab-icon prescription"
                                            title={el?.attachment}
                                            target="_blank"
                                          >
                                            <span>
                                              <i className="fa-solid fa-paperclip"></i>
                                            </span>
                                            {el?.attachment?.length > 20
                                              ? `${el.attachment.slice(
                                                  0,
                                                  20
                                                )}...`
                                              : el?.attachment}
                                          </a>
                                        ) : (
                                          <span
                                            className="lab-icon prescription"
                                            style={{ cursor: "pointer" }}
                                          >
                                            {el?.name || "--"}
                                          </span>
                                        )}
                                      </td>
                                      <td>{getDateFormate(el?.updatedAt)}</td>
                                      <td>
                                        {truncateAllText(el?.description)}
                                      </td>
                                      <td>
                                        <div className="action-item">
                                          {/* <a href="#">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                          </a> */}
                                          <a
                                            href={el?.attachment}
                                            className="lab-icon prescription"
                                            title={el?.attachment}
                                            target="_blank"
                                          >
                                            <i className="fa-solid fa-download"></i>
                                          </a>
                                          <a
                                            onClick={() =>
                                              handleDelete(el?._id)
                                            }
                                          >
                                            <i className="fa-solid fa-trash-can"></i>
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                );
                              })}
                          </table>
                          <NotFound
                            loading={reportLoading}
                            isData={isReports?.length > 0}
                            message="No Reports found."
                          />
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
                                <th>Appointment</th>
                                <th>File Name</th>
                                <th>Created Date</th>
                                <th>Prescribed By</th>
                                <th>Action</th>
                              </tr>
                            </thead>

                            {!loading &&
                              appointmentData?.length > 0 &&
                              appointmentData
                                .filter(
                                  (it) =>
                                    it?.prescriptionFile || it?.prescriptionText
                                )
                                ?.map((el, index) => {
                                  return (
                                    <tbody>
                                      {console.log(el, "eleleell")}
                                      <tr>
                                        <td className="text-blue-600">
                                          <a
                                            data-bs-toggle="modal"
                                            data-bs-target="#view_prescription"
                                          >
                                            {getIdLastDigits(el?._id, "PR-")}
                                          </a>
                                        </td>
                                        <td>
                                          <span className="lab-icon prescription">
                                            {el?.name ||
                                              el?.testName ||
                                              "Electro cardiograph"}
                                          </span>
                                        </td>
                                        <td>
                                          {el?.prescriptionFile ? (
                                            <a
                                              href={el?.prescriptionFile}
                                              className="lab-icon prescription"
                                              title={el?.prescriptionFile}
                                              target="_blank"
                                            >
                                              <span>
                                                <i className="fa-solid fa-prescription"></i>
                                              </span>
                                              {el?.prescriptionFile?.length > 20
                                                ? `${el.prescriptionFile.slice(
                                                    0,
                                                    20
                                                  )}...`
                                                : el?.prescriptionFile}
                                            </a>
                                          ) : (
                                            <span
                                              className="lab-icon prescription"
                                              onClick={() =>
                                                setSelectedPrescription(el)
                                              }
                                              style={{ cursor: "pointer" }}
                                            >
                                              {truncateAllText(
                                                el?.prescriptionText ||
                                                  el?.comments ||
                                                  "--"
                                              )}
                                            </span>
                                          )}
                                        </td>
                                        <td>
                                          {getDateFormate(el?.prescriptionDate)}
                                        </td>
                                        <td>
                                          <h2 className="table-avatar">
                                            <a className="avatar avatar-sm me-2">
                                              <img
                                                className="avatar-img rounded-3"
                                                src={
                                                  el?.refDoctor?.coverImage ||
                                                  user_img
                                                }
                                                alt="User Image"
                                              />
                                            </a>
                                            <a>{el?.refDoctor?.displayName}</a>
                                          </h2>
                                        </td>
                                        <td>
                                          <div className="action-item">
                                            {el?.prescriptionFile ? (
                                              <a
                                                href={el?.prescriptionFile}
                                                className="lab-icon prescription"
                                                title={el?.prescriptionFile}
                                                target="_blank"
                                              >
                                                <i className="fa-solid fa-download"></i>
                                              </a>
                                            ) : (
                                              <a
                                                className="lab-icon prescription"
                                                onClick={() =>
                                                  setSelectedPrescription(el)
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <i className="fa-solid fa-eye"></i>
                                              </a>
                                            )}

                                            <a
                                              onClick={() =>
                                                handleUpdate(el?._id)
                                              }
                                            >
                                              <i className="fa-solid fa-trash-can"></i>
                                            </a>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  );
                                })}
                          </table>
                          <NotFound
                            loading={loading}
                            isData={
                              appointmentData?.length > 0 &&
                              appointmentData.filter(
                                (it) => it?.prescriptionFile
                              )?.length > 0
                            }
                            message="No prescriptions found."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </div>

      {/* Modal for adding medical record */}
      <Modal
        show={showModal}
        onHide={() => {
          handleModelClose();
          setFile(null); // Reset file when modal closes
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Medical Record</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            {/* Name Field */}
            <Form.Group className="mb-3" controlId="formRecordName">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter record name"
                {...register("name")}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Description Field */}
            <Form.Group className="mb-3" controlId="formRecordDescription">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                {...register("description")}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* File Upload Field */}
            <Form.Group className="mb-3" controlId="formFile">
              <Form.Label>
                Attach File <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept="/pdf"
                onChange={handleFileChange}
                isInvalid={!!errors.file}
              />
              {isFile && (
                <div className="mt-2">
                  <small className="text-muted">
                    Selected file: {isFile.name}
                  </small>
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.file?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModelClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={!isFile}>
              Save Medical Record
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {selectedPrescription && (
        <PrescriptionDetailsModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </>
  );
};

export default Dashboard;
