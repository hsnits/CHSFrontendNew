import React, { useEffect, useMemo } from "react";
import { Col, Row, Tab, Accordion } from "react-bootstrap";
import useGetMountData from "../../helpers/getDataHook";
import { Trash2 } from "react-feather";
import { callDeleteApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getMdHTMLValue } from "../../helpers/utils";
import NotFound from "../../components/common/notFound";

const SymptomReport = ({ userData, allReports, loading, getAllData }) => {
  const handleDelete = async (id) => {
    try {
      const response = await callDeleteApi(`/patient/report/${id}`);
      if (response?.status) {
        toastMessage("success", "Symptom report deleted successfully!");
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
                              handleDelete(item?._id);
                            }}
                            style={{ paddingRight: 10, cursor: "pointer" }}
                          >
                            <Trash2 color="red" size={20} />
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>
                          <strong>Age:</strong> {item?.age}
                        </p>
                        <p>
                          <strong>Height:</strong> {item?.height} cm
                        </p>
                        <p>
                          <strong>Weight:</strong> {item?.weight} kg
                        </p>
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
    </>
  );
};

export default SymptomReport;
