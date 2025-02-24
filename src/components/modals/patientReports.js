import React, { useState } from "react";
import { Modal, Accordion, Button, Spinner } from "react-bootstrap";
import NotFound from "../common/notFound";
import useGetMountData from "../../helpers/getDataHook";
import { getMdHTMLValue } from "../../helpers/utils";
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";

const AppointmentReports = ({
  customData,
  showModal,
  handleClose,
  handleUpdate,
}) => {
  const [reportTreatment, setReportTreatment] = useState({});
  const [anzLoading, setAnzLoading] = useState(null);

  const { data: isReports, loading } = useGetMountData(
    `/patient/reports/${customData?.patientId?._id}`
  );

  const handleAnalyser = async (item) => {
    try {
      setAnzLoading(item?._id);
      const response = await callPostApi(`/doctor/symptom-analyser`, {
        patientReport: item?.symptomReport,
        reportId: item?._id,
      });
      if (response?.status) {
        setAnzLoading(false);
        toastMessage("success", "Symptom report analyzed successfully!");
        setReportTreatment((prev) => ({
          ...prev,
          [response.data?.reportId]: response.data?.treatmentPlan,
        }));
      }
    } catch (error) {
      setAnzLoading(false);
      console.error("analyser operation error:", error);
      toastMessage("error", "An unexpected error occurred while analyzing.");
    }
  };

  const handleStart = async () => {
    console.log(customData, "customData");
    await handleUpdate(customData?._id, "Completed");
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Appointment Reports</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-3">
          {loading || isReports?.length === 0 ? (
            <NotFound
              loading={loading}
              isData={isReports?.length > 0}
              message="No symptom reports found."
              loaderLabel="Fetching symptom reports..."
            />
          ) : (
            <Accordion>
              {isReports.map((item, index) => (
                <Accordion.Item eventKey={item?._id.toString()} key={item?._id}>
                  <Accordion.Header>
                    <span>{`${index + 1}. Report for: ${item?.symptoms}`}</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="report-info">
                      <p>
                        <strong>Age:</strong> {item?.age}
                      </p>
                      <p>
                        <strong>Height:</strong> {item?.height} cm
                      </p>
                      <p>
                        <strong>Weight:</strong> {item?.weight} kg
                      </p>
                    </div>

                    <h4 className="mt-3">
                      <strong>Summary:</strong>
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: getMdHTMLValue(JSON.parse(item?.symptomReport)),
                      }}
                    />

                    {!reportTreatment[item?._id] && (
                      <div className="mt-3 text-center">
                        <Button
                          disabled={anzLoading === item?._id}
                          onClick={() => handleAnalyser(item)}
                          variant="primary"
                        >
                          Analyze Report{" "}
                          {anzLoading === item?._id && (
                            <Spinner
                              animation="border"
                              size="sm"
                              className="ms-2"
                            />
                          )}
                        </Button>
                      </div>
                    )}

                    {reportTreatment[item?._id] && (
                      <div className="mt-4 p-3 border rounded bg-light">
                        <h4>
                          <strong>Identified Treatment:</strong>
                        </h4>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getMdHTMLValue(reportTreatment[item?._id]),
                          }}
                        />
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={Object.keys(reportTreatment)?.length == 0}
          onClick={handleStart}
        >
          Start Appointment
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>

      {/* Custom Styles */}
      <style jsx>{`
        .report-info p {
          margin: 0;
        }
        .bg-light {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </Modal>
  );
};

export default AppointmentReports;
