import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Tab, Accordion } from "react-bootstrap";
import useGetMountData from "../../helpers/getDataHook";
import { Trash2 } from "react-feather";
import { callDeleteApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getMdHTMLValue } from "../../helpers/utils";
import NotFound from "../../components/common/notFound";
import DeleteModal from "../../components/modals/delete-modal";

const SymptomReport = ({ userData, allReports, loading, getAllData }) => {
  const [isOpen, setIsOpen] = useState({ is: false, id: null });

  const handleDelete = async () => {
    try {
      const response = await callDeleteApi(`/patient/report/${isOpen?.id}`);
      if (response?.status) {
        toastMessage("success", "Symptom report deleted successfully!");
        setIsOpen({ is: false, id: null });
        getAllData(`/patient/reports/${userData?.profile?._id}`);
      }
    } catch (error) {
      console.error("Delete operation error:", error);
      toastMessage("error", "An unexpected error occurred while deleting.");
    }
  };

  return (
    <>
      <Row>
        <div className="dashboard-header">
          <h3>Symptom Reports</h3>
        </div>
        <Col xl="12" className="d-flex">
          <div className="dashboard-card w-100">
            <Accordion>
              {(loading || allReports?.length == 0) && (
                <NotFound
                  loading={loading}
                  isData={allReports?.length > 0}
                  message="No symptom reports found."
                  loaderLabel="Symptom reports getting..."
                />
              )}
              {!loading &&
                allReports?.length > 0 &&
                allReports.map((item, index) => (
                  <>
                    <Accordion.Item
                      eventKey={item?._id.toString()}
                      key={item?._id}
                    >
                      <Accordion.Header>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span>{`${index + 1} Report for: ${
                            item?.symptoms
                          }`}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen({ is: true, id: item?._id });
                            }}
                            style={{ paddingRight: 10, cursor: "pointer" }}
                          >
                            <Trash2 color="red" size={20} />
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex justify-between">
                            <strong>Age:</strong>{" "}
                            <span>{item?.age || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong>Height:</strong>{" "}
                            <span>
                              {item?.height ? `${item.height} cm` : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <strong>Weight:</strong>{" "}
                            <span>
                              {item?.weight ? `${item.weight} kg` : "-"}
                            </span>
                          </div>
                        </div>

                        {/* Vitals */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {item?.bloodPressure && (
                            <div className="flex justify-between">
                              <strong>Blood Pressure:</strong>
                              <span>{item?.bloodPressure}</span>
                            </div>
                          )}
                          {item?.bodyTemperature && (
                            <div className="flex justify-between">
                              <strong>Body Temperature:</strong>
                              <span>{item?.bodyTemperature}°C</span>
                            </div>
                          )}
                          {item?.spo2 && (
                            <div className="flex justify-between">
                              <strong>SpO2:</strong>
                              <span>{item?.spo2}%</span>
                            </div>
                          )}
                        </div>

                        {/* <p>
                          <strong>Height:</strong> {item?.height} cm
                        </p> */}
                        {/* <p>
                          <strong>Weight:</strong> {item?.weight} kg
                        </p> */}

                        {/* <p>
                          <strong>Body Temperature:</strong> {item?.bodyTemperature}
                        </p>
                        <p>
                          <strong>Heart Rate:</strong> {item?.heartRate} 
                        </p> */}

                        <p>
                          <strong>Summary:</strong>{" "}
                          <p
                            dangerouslySetInnerHTML={{
                              __html: getMdHTMLValue(
                                JSON.parse(item?.symptomReport)
                              ),
                            }}
                          />
                        </p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </>
                ))}
            </Accordion>
          </div>
        </Col>
      </Row>
      <DeleteModal
        isOpen={isOpen?.is}
        onClose={() => setIsOpen({ is: false, id: null })}
        title="Are you sure you want to delete this report ?"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default SymptomReport;
