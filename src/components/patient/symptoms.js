import React, { useEffect, useMemo, useRef, useState } from "react";
import bodyImg from "../../assets/images/img.png";
import markdownit from "markdown-it";
import { callPostApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { symptomSocket } from "../../config/socket";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  age: yup.string().required("Age is required"),
  height: yup
    .string()
    .required("Height is required")
    .matches(/^[0-9]+$/, "Height must be numeric"),
  weight: yup
    .string("Weight must be numeric")
    .required("Weight is required")
    .matches(/^[0-9]+$/, "Weight must be numeric "),
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
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = async () => {
    return;
    try {
      setLoading(true);
      const response = await callPostApi("/patient/symptom-checker", {});
      if (!response?.status) throw new Error(response?.message);
      setLoading(false);
      toastMessage("success", "symptoms checker sending...");
    } catch (error) {}
  };

  console.log(errors, "errrororr");
  useEffect(() => {
    symptomSocket.on("summary", (messages) => {
      console.log(messages, "summary");
      if (messages && messages?.summary) {
        setLoading(false);
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
                      <h5 className="card-title">
                        Symptom Checker WITH BODY MAP
                      </h5>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="iq-card-body pt-6">
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
                              <div class="col-lg-12 col-md-6">
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
                                  className="form-control my-2"
                                  rows="9"
                                  placeholder="Type your symptoms in detail's here"
                                ></textarea>
                              )}
                            />
                            <p className="text-danger">
                              {errors.symptoms?.message}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            {loading ? (
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
                                {" "}
                                <label class="col-form-label">
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
                                  style={{ maxHeight: "67vh" }}
                                  width="100%"
                                  alt="Body Map"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit" // onClick={() => handleSubmit(onSubmit)}
                        className="btn btn-primary me-1"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
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
