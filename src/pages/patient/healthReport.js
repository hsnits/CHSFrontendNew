import React, { useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import user_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getDateFormate } from "../../helpers/utils";
import noDataImg from "../../assets/images/noDataFound.gif";
import { callPostApi, callPutApi } from "../../_service";
import { userProfile } from "../../redux/slices/userApi";
import { useDispatch } from "react-redux";
import { toastMessage } from "../../config/toast";

const HealthReport = ({ data, activeTab }) => {
  const {
    data: isReports,
    loading,
    setLoading,
    getAllData,
    isOpen,
    customData,
    openModelWithItem,
  } = useGetMountData(null);

  useEffect(() => {
    if (data?._id && activeTab === "third") {
      getAllData(`/patient/health-report/${data?._id}`);
    }
  }, [data, activeTab]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toastMessage("error","No file selected.");
      return;
    }

    // ✅ Allowed file types (PDF & DOC)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toastMessage("error", "Please upload a valid document (PDF or DOC).");
      return;
    }

    // ✅ Max file size = 10MB
    if (file.size > 10 * 1024 * 1024) {
      toastMessage("error","File size exceeds the 10MB limit.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      toastMessage("success", "Health report is uploading...");
      // ✅ Upload File
      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) {
        throw new Error("Invalid response from server.");
      }

      const updateRes = await callPutApi(
        `/patient/update-health-report/${data?._id}`,
        {
          healthFile: res.data.location,
          fileKey: res.data.key,
          fileName: res?.data?.originalname,
        }
      );

      console.log(updateRes);
      if (updateRes?.status) {
        toastMessage("success", "Health report is updated.");

        await getAllData(`/patient/health-report/${data?._id}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
      toastMessage("error", "File upload failed. Please try again.");
    }
  };

  return (
    <>
      <Row>
        <div className="dashboard-header">
          <h3>Health Report</h3>
        </div>
        <Col xl="12" className="d-flex">
          <div className="dashboard-card w-100">
            <div className="dashboard-card-head">
              <div className="header-title">
                <h5>Health Records</h5>
              </div>
              <a href="#">
                <img
                  src={data?.coverImage ?? user_img}
                  className="avatar dropdown-avatar"
                  alt="User"
                />
                &nbsp; &nbsp;{data?.profile?.firstName}
              </a>
            </div>
            <div className="dashboard-card-body">
              <Row>
                <Col lg="12" md="12" sm="12">
                  {!loading && isReports ? (
                    <Row>
                      <Col lg="12" md="12">
                        <div className="report-gen-date">
                          <p>
                            Report Last Updated:{" "}
                            {getDateFormate(isReports?.updatedAt)}
                          </p>
                        </div>

                        {isReports?.healthFile && (
                          // If a file is uploaded, show file info
                          <div className="mt-3">
                            <p>
                              <strong>Report File: </strong>
                              <a
                                href={isReports.healthFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary"
                              >
                                {isReports?.fileName ||
                                  isReports?.healthFile.split("/").pop()}
                              </a>
                            </p>
                            <label className="btn btn-outline-primary">
                              Re-upload Report
                              <input
                                type="file"
                                className="d-none"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                readOnly={loading}
                              />
                            </label>
                          </div>
                        )}
                      </Col>
                    </Row>
                  ) : (
                    <div className="modal-btn text-center flex flex-col items-center">
                      <div className="mb-2">
                        <img
                          height={200}
                          width={400}
                          className="w-20 h-20 object-contain mx-auto"
                          src={noDataImg}
                          alt="No Data"
                        />
                      </div>
                      <label className="btn btn-success">
                        Upload Health Report
                        <input
                          type="file"
                          className="d-none"
                          accept=".pdf,.doc,.docx"
                          readOnly={loading}
                          onChange={handleFileChange}
                        />
                      </label>
                      {loading && (
                        <span>
                          fetching... <Spinner />
                        </span>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default HealthReport;

// import React, { useEffect } from "react";
// import { Col, Row, Tab } from "react-bootstrap";
// import user_img from "../../assets/img/dr_profile.jpg";
// import EditReport from "../../components/modals/edit-report";
// import useGetMountData from "../../helpers/getDataHook";
// import { getDateFormate } from "../../helpers/utils";
// import noDataImg from "../../assets/images/noDataFound.gif";

// const HealthReport = ({ data, activeTab }) => {
//   const {
//     data: isReports,
//     loading,
//     getAllData,
//     isOpen,
//     customData,
//     openModelWithItem,
//   } = useGetMountData(null);

//   useEffect(() => {
//     if (data?._id && activeTab == "third") {
//       getAllData(data?._id ? `/patient/health-report/${data?._id}` : null);
//     }
//   }, [data, activeTab]);

//   return (
//     <>
//       <Row>
//         <div className="dashboard-header">
//           <h3>Health </h3>
//         </div>
//         <Col xl="12" className="d-flex">
//           <div className="dashboard-card w-100">
//             <div className="dashboard-card-head">
//               <div className="header-title">
//                 <h5>Health Records</h5>
//               </div>
//               <a href="#">
//                 <img
//                   src={data?.coverImage ?? user_img}
//                   className="avatar dropdown-avatar"
//                   alt="Img"
//                 />
//                 &nbsp; &nbsp;{data?.profile?.firstName}
//               </a>
//             </div>
//             <div className="dashboard-card-body">
//               <Row>
//                 <Col lg="12" md="12" sm="12">
//                   {!loading && isReports && Object.keys(isReports) != 0 ? (
//                     <Row>
//                       <Col lg="4">
//                         <div className="health-records icon-orange">
//                           <span>
//                             <i className="fa-solid fa-heart"></i>
//                             Heart Rate
//                           </span>
//                           <h3>
//                             {isReports?.heartRate} Bpm <sup> 2%</sup>
//                           </h3>
//                         </div>
//                       </Col>
//                       <Col lg="4">
//                         <div className="health-records icon-amber">
//                           <span>
//                             <i className="fa-solid fa-temperature-high"></i>
//                             Body Temprature
//                           </span>
//                           <h3>{isReports?.bodyTemperature} C</h3>
//                         </div>
//                       </Col>
//                       <Col lg="4">
//                         <div className="health-records icon-dark-blue">
//                           <span>
//                             <i className="fa-solid fa-notes-medical"></i>
//                             Glucose Level
//                           </span>
//                           <h3>
//                             {isReports?.glucoseLevel}
//                             <sup> 6%</sup>
//                           </h3>
//                         </div>
//                       </Col>
//                       <Col lg="4">
//                         <div className="health-records icon-blue">
//                           <span>
//                             <i className="fa-solid fa-highlighter"></i>
//                             SPo2
//                           </span>
//                           <h3>{isReports?.spo2}%</h3>
//                         </div>
//                       </Col>
//                       <Col lg="4">
//                         <div className="health-records icon-red">
//                           <span>
//                             <i className="fa-solid fa-syringe"></i>
//                             Blood Pressure
//                           </span>
//                           <h3>
//                             {isReports?.bloodPressure} mg/dl<sup> 2%</sup>
//                           </h3>
//                         </div>
//                       </Col>
//                       <Col lg="4">
//                         <div className="health-records icon-purple">
//                           <span>
//                             <i className="fa-solid fa-user-pen"></i>
//                             BMI{" "}
//                           </span>
//                           <h3>{isReports?.bmi} kg/m2</h3>
//                         </div>
//                       </Col>
//                       <Col lg="12" md="12">
//                         <div className="report-gen-date">
//                           <p>
//                             Report generated on last visit :{" "}
//                             {getDateFormate(isReports?.updatedAt)}{" "}
//                             {/* <span>
//                               <i className="fa-solid fa-copy"></i>
//                             </span> */}
//                           </p>
//                         </div>
//                         <div className="modal-btn text-end">
//                           <button
//                             onClick={() => openModelWithItem("edit", isReports)}
//                             className="btn btn-primary"
//                           >
//                             Edit Report
//                           </button>
//                         </div>
//                       </Col>
//                     </Row>
//                   ) : (
//                     <div className="modal-btn text-center flex flex-col items-center">
//                       <div className="mb-2">
//                         <img
//                           height={200}
//                           width={400}
//                           className="w-20 h-20 object-contain mx-auto"
//                           src={noDataImg}
//                           alt="No Data"
//                         />
//                       </div>
//                       <button
//                         onClick={() => openModelWithItem("add")}
//                         className="btn btn-primary"
//                       >
//                         Add Health Report
//                       </button>
//                     </div>
//                   )}
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <EditReport
//         userId={data?._id}
//         isOpen={isOpen}
//         onClose={openModelWithItem}
//         reportData={isReports || customData}
//         refreshData={() => getAllData(`/patient/health-report/${data?._id}`)}
//       />
//     </>
//   );
// };

// export default HealthReport;
