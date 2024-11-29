import React, { useEffect, useRef, useState } from "react";
import bodyImg from "../assets/images/img.png";
import markdownit from "markdown-it";
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { symptomSocket } from "../../config/socket";

const PatSymptoms = () => {
  const [symptoms, setSymptoms] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    symptomSocket.on("summary", (messages) => {
      console.log(messages, "summary");
      if (messages && messages?.summary) {
        setLoading(false);
        // setTimeout(() => {
        setSummary(messages?.summary);
        // }, 400);
      }
    });

    symptomSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      symptomSocket.off("summary");
      symptomSocket.off("disconnect");
    };
  }, [symptomSocket]);

  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      setTimeout(() => {
        endRef.current.scrollTop = endRef.current.scrollHeight; // Scroll to the bottom
      }, 300);
    }
  }, [summary]);

  const md = markdownit({
    html: false,
    linkify: true,
    typographer: true,
  });

  const renderedText = React.useMemo(() => md.render(summary), [summary]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await callPostApi("/patient/symptom-checker", {
        symptoms,
      });
      if (!response?.status) throw new Error(response?.message);
      setLoading(false);
      toastMessage("success", "symptoms checker sending...");
    } catch (error) {}
  };

  return (
    <div id="root">
      {/* Wrapper Start */}
      <div className="wrapper">
        {/* Content */}
        <div id="content-page" className="content-page">
          {/* Main Content */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12 col-lg-12">
                <div className="iq-card">
                  <div className="iq-card-header d-flex justify-content-between">
                    <div className="iq-header-title">
                      <h4 className="card-title">
                        Symptom Checker WITH BODY MAP
                      </h4>
                    </div>
                  </div>
                  <div className="iq-card-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <div class="row">
                            <div class="col-lg-6 col-md-6">
                              <div class="form-wrap">
                                <label class="col-form-label">
                                  Age <span class="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter age"
                                />
                              </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                              <div class="form-wrap">
                                <label class="col-form-label">
                                  Height (cm) <span class="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter height in cm"
                                />
                              </div>
                            </div>
                            <div class="col-lg-12 col-md-6">
                              <div class="form-wrap">
                                <label class="col-form-label">
                                  Weight (kg) <span class="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter weight in kg"
                                />
                              </div>
                            </div>
                          </div>
                          <label class="col-form-label">
                            What are your symptoms?{" "}
                            <span class="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control my-2"
                            rows="9"
                            placeholder="Type your symptoms in detail's here"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target?.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                          {loading ? (
                            <div className="form-group">
                              Generating! Hold on please...
                            </div>
                          ) : summary ? (
                            <>
                              {" "}
                              {/* <textarea
                                className="form-control my-2"
                                id="exampleFormControlTextarea1"
                                rows="18"
                                value={summary} // Use raw summary text for textarea
                                placeholder="Type your main rep here"
                                readOnly
                              /> */}
                              <label htmlFor="exampleInputText1">
                                Identified Symptoms :
                              </label>
                              <div
                                className="form-control my-2 genrate_para"
                                style={{
                                  minHeight: "27rem",
                                  padding: "10px",
                                  border: "1px solid #ced4da",
                                  borderRadius: "0.375rem",
                                  backgroundColor: "#fff",
                                  overflowY: "auto",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: renderedText,
                                }}
                                ref={endRef}
                              />
                            </>
                          ) : (
                            <div class="row">
                              <img
                                src={bodyImg}
                                style={{ maxHeight: "60vh" }}
                                width="100%"
                                alt="Body Map"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary me-1"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatSymptoms;
