import React, { useEffect, useMemo, useRef, useState } from "react";
import bodyImg from "../../assets/images/img.png";
import markdownit from "markdown-it";
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { symptomSocket } from "../../config/socket";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tab } from "react-bootstrap";
import { Col } from "reactstrap";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { Copy } from "react-feather";

const schema = yup.object().shape({
  age: yup
    .string()
    .required("Age is required")
    .matches(/^[0-9]+$/, "Age must be numeric"),
  height: yup
    .string()
    .required("Height is required")
    .matches(/^[0-9]+$/, "Height must be numeric"),
  weight: yup
    .string("Weight must be numeric")
    .required("Weight is required")
    .matches(/^[0-9]+$/, "Weight must be numeric"),
  gender: yup.string("Gender must be numeric").required("Gender is required"),
  bloodPressure: yup
    .string("Blood Pressure must be numeric")
    .matches(/^[1-9]+$/, "Blood Pressure must be numeric"),
  heartRate: yup
    .number()
    .min(30, "Heart rate should be at least 30 bpm")
    .max(200, "Heart rate should not exceed 200 bpm"),

  bodyTemperature: yup
    .number()
    .min(30, "Body temperature should be at least 30°C")
    .max(45, "Body temperature should not exceed 45°C"),

  spo2: yup
    .number()
    .min(50, "SpO2 should be at least 50%")
    .max(100, "SpO2 should not exceed 100%"),
  symptoms: yup.string().required("Symptoms is required"),
});

const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
});

const PatSymptoms = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);
  const renderedText = useMemo(() => md.render(summary), [summary]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await callPostApi("/patient/symptom-checker", {
        symptoms: watch("symptoms"),
        age: watch("age"),
        height: watch("height"),
        weight: watch("weight"),
        gender: watch("gender"),
        bloodPressure: watch("bloodPressure"),
        heartRate: watch("heartRate"),
        bodyTemperature: watch("bodyTemperature"),
        spo2: watch("spo2"),
      });
      if (!response) throw new Error(response?.message);
      setLoading(false);
      // toastMessage("success", "symptoms checker sending...");
    } catch (error) {}
  };

  const handleSave = async () => {
    const profileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

    try {
      setLoading("save");
      const response = await callPostApi(
        `/patient/save-checked-symptom/${profileId}`,
        {
          age: watch("age"),
          height: watch("height"),
          weight: watch("weight"),
          symptoms: watch("symptoms"),
          symptomReport: JSON.stringify(summary),
        }
      );
      if (!response?.status) throw new Error(response?.message);
      handleReset();
      toastMessage("success", "Identity symptoms are saved successfully.");
    } catch (error) {}
  };

  const handleReset = () => {
    reset();
    setLoading(false);
    setSummary("");
  };

  const handleCopyClick = (input) => {
    navigator.clipboard
      .writeText(input)
      .then(() => {
        toastMessage("success", "Copied to clipboard");
      })
      .catch((error) => {
        toastMessage("error", "Cant copy this!");
      });
  };

  useEffect(() => {
    symptomSocket.on("summary", (messages) => {
      if (messages && messages?.summary) {
        setSummary(messages?.summary);
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

  useEffect(() => {
    if (endRef.current) {
      setTimeout(() => {
        endRef.current.scrollTop = endRef.current.scrollHeight; // Scroll to the bottom
      }, 300);
    }
  }, [summary]);

  return (
    <>
      <div className="dashboard-header">
        <h3>Symptoms</h3>
      </div>
      <Col lg="12" xl="12" className="d-flex">
        <div className="dashboard-card w-100">
          {/* <div id="root"> */}
          {/* Wrapper Start */}
          {/* <div className="wrapper"> */}
          {/* Content */}
          <div id="content-page" className="content-page">
            {/* Main Content */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12 col-lg-12">
                  <div className="iq-card">
                    <div className="iq-card-header d-flex justify-content-between">
                      <div className="iq-header-title">
                        <h5 className="card-title">
                          Symptom Checker WITH BODY MAP
                        </h5>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="iq-card-body pt-3">
                        {!summary ? (
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <div class="row">
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Age <span class="text-danger">*</span>
                                      </label>
                                      <Controller
                                        name="age"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter age"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.age?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Height (cm){" "}
                                        <span class="text-danger">*</span>
                                      </label>
                                      <Controller
                                        name="height"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter height in (cm)"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.height?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Weight (kg){" "}
                                        <span class="text-danger">*</span>
                                      </label>
                                      <Controller
                                        name="weight"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter weight in (kg)"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.weight?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-wrap">
                                      <label className="col-form-label">
                                        Gender{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                          <select
                                            {...field}
                                            className="form-control"
                                          >
                                            <option value="">
                                              Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                              Female
                                            </option>
                                            <option value="other">Other</option>
                                          </select>
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.gender?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Blood Pressure (mg/dl)
                                      </label>
                                      <Controller
                                        name="bloodPressure"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter Blood Pressure (mg/dl)"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.bloodPressure?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Body Temperature (c)
                                      </label>
                                      <Controller
                                        name="bodyTemperature"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter Body Temperature (c)"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.bodyTemperature?.message}
                                      </p>
                                    </div>
                                  </div>{" "}
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">
                                        Heart Rate (Bpm)
                                      </label>
                                      <Controller
                                        name="heartRate"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter Heart Rate (Bpm)"
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.heartRate?.message}
                                      </p>
                                    </div>
                                  </div>
                                  <div class="col-lg-6 col-md-6">
                                    <div class="form-wrap">
                                      <label class="col-form-label">SPo2</label>
                                      <Controller
                                        name="spo2"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="number"
                                            class="form-control"
                                            placeholder="Enter SPo2 "
                                          />
                                        )}
                                      />
                                      <p className="text-danger">
                                        {errors.spo2?.message}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <label class="col-form-label">
                                  What are your symptoms?{" "}
                                  <span class="text-danger">*</span>
                                </label>
                                <Controller
                                  name="symptoms"
                                  control={control}
                                  render={({ field }) => (
                                    <textarea
                                      {...field}
                                      className="form-control "
                                      rows="6"
                                      placeholder="Type your symptoms in detail's here"
                                    ></textarea>
                                  )}
                                />
                                <p className="text-danger">
                                  {errors.symptoms?.message}
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-6 ">
                              <img
                                src={bodyImg}
                                style={{ paddingTop: "7vh" }}
                                width="100%"
                                alt="Body Map"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group">
                                {loading && !summary ? (
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
                                  >
                                    <div class="col-form-label">
                                      Symptom report is generating! Hold on
                                      please...
                                    </div>
                                  </div>
                                ) : summary ? (
                                  <>
                                    <div>
                                      <label class="col-lg-3 col-form-label">
                                        Age : {watch("age")}
                                      </label>
                                      <label class="col-lg-3 col-form-label">
                                        Height : {`${watch("height")}cm`}
                                      </label>
                                      <label class=" col-lg-3 col-form-label">
                                        Weight : {`${watch("weight")}kg`}
                                      </label>
                                      <label class="col-lg-3 col-form-label">
                                        Gender : {watch("gender")}
                                      </label>
                                      {watch("bloodPressure") && (
                                        <label class="col-lg-3 col-form-label">
                                          Blood Pressure :{" "}
                                          {`${watch("bloodPressure")}mg/dl`}
                                        </label>
                                      )}
                                      {watch("heartRate") && (
                                        <label class=" col-lg-3 col-form-label">
                                          Heart Rate :{" "}
                                          {`${watch("heartRate")}Bpm`}
                                        </label>
                                      )}
                                      {watch("bodyTemperature") && (
                                        <label class=" col-lg-3 col-form-label">
                                          Body Temperature :{" "}
                                          {`${watch("bodyTemperature")}c`}
                                        </label>
                                      )}
                                      {watch("spo2") && (
                                        <label class=" col-lg-3 col-form-label">
                                          SPo2 : {`${watch("spo2")}`}
                                        </label>
                                      )}
                                      <div>
                                        <label class=" col-lg-12  col-form-label">
                                          Symptom :{" "}
                                          <div className="pt-2">
                                            <Controller
                                              name="symptoms"
                                              control={control}
                                              render={({ field }) => (
                                                <textarea
                                                  {...field}
                                                  className="form-control "
                                                  readOnly
                                                  rows="2"
                                                  placeholder="Type your symptoms in detail's here"
                                                ></textarea>
                                              )}
                                            />
                                          </div>
                                        </label>
                                      </div>
                                    </div>{" "}
                                    <label class="col-form-label">
                                      Identified Symptoms :
                                    </label>
                                    <div style={{ position: "relative" }}>
                                      {summary && !loading && (
                                        <span
                                          disabled={loading}
                                          onClick={() =>
                                            handleCopyClick(summary)
                                          }
                                          className="btn btn-sm cursor-pointer"
                                          style={{
                                            position: "absolute",
                                            top: "0",
                                            right: "0",
                                            zIndex: "10",
                                            color: "#6c757d",
                                            padding: "10px 20px",
                                            transition:
                                              "background-color 0.3s ease, color 0.3s ease",
                                          }}
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Copy" // Tooltip content
                                        >
                                          <Copy />
                                        </span>
                                      )}

                                      <div
                                        className="form-control my-2 genrate_para"
                                        style={{
                                          minHeight: "20rem",
                                          padding: "8px",
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
                                    </div>
                                    {summary && !loading && (
                                      <>
                                        {" "}
                                        <label className="col-form-label">
                                          Disclaimer :
                                        </label>
                                        <div className="form-control mb-4 disclaimer-container">
                                          <span className="badge note-badge blinking">
                                            ⚠️ Note
                                          </span>
                                          <p className="disclaimer-text">
                                            The advice provided above is
                                            generated by our artificial
                                            intelligence technology and is
                                            intended to be as accurate as
                                            possible. However, please consult a
                                            doctor before implementing any
                                            recommendations.
                                          </p>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                          <button
                                            type="button"
                                            disabled={loading}
                                            onClick={handleReset}
                                            className="btn btn-secondary me-1"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            disabled={loading}
                                            onClick={handleSave}
                                            className="btn btn-primary me-1"
                                          >
                                            {loading == "save"
                                              ? "Saving..."
                                              : "Save & Continue"}
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <div class="row">
                                    <img
                                      src={bodyImg}
                                      style={{ maxHeight: "65vh" }}
                                      width="100%"
                                      alt="Body Map"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {!summary && (
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary me-3"
                          >
                            {loading ? "Processing..." : "Submit"}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </Col>
    </>
  );
};

export default PatSymptoms;
