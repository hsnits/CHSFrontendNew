import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { ChevronDown, ChevronUp, Image } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { LanguagesList } from "../../constants/common";
import { callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { Spinner } from "reactstrap";
import { STORAGE } from "../../constants";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  // displayName: yup.string().required("Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  designation: yup.string().required("Designation is required"),
  languages: yup
    .array()
    .required("Languages is required.")
    .min(1, "Please select at least one languages."),
});

const Profile = ({ getAllData, doctorDetails }) => {
  console.log(doctorDetails, "doctorDetails");

  const [listOpen, setListOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: doctorDetails?.profile || {},
  });

  const onSubmit = async (value) => {
    try {
      let updatedData = {
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        displayName: watch("displayName"),
        designation: watch("designation"),
        phoneNumber: watch("phoneNumber"),
        email: watch("email"),
        languages: watch("languages"),
      };
      setLoading(true);
      const verifyResponse = await callPutApi(
        `/doctor/${doctorDetails?._id}`,
        updatedData
      );

      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      setLoading(false);
      toastMessage("success", "Profile is updated successfully.");
      await getAllData("/user");
      const userProfile = getLocalStorage(STORAGE.USER_KEY);
      let profile = userProfile.profile;

      let updatedStorage = {
        ...userProfile,
        name: watch("firstName"),
        phoneNumber: watch("phoneNumber"),
        email: watch("email"),
        profile: {
          ...profile,
          ...updatedData,
        },
      };

      setLocalStorage(STORAGE.USER_KEY, updatedStorage);
    } catch (error) {
      setLoading(false);
      toastMessage("error", "Availability update process failed!");
    }
  };

  useEffect(() => {
    if (doctorDetails?.profile) {
      reset(doctorDetails?.profile);
    }
  }, [doctorDetails, reset]);

  const handleSelect = (e) => {
    let selectedLanguage = e.target.value;
    let currentLanguages = watch("languages") || [];

    let updatedLanguages = currentLanguages.includes(selectedLanguage)
      ? currentLanguages.filter((lang) => lang !== selectedLanguage)
      : [...currentLanguages, selectedLanguage];

    setValue("languages", updatedLanguages);
    setError("languages", null);
  };

  const handleRemove = (key) => {
    let currentLanguages = watch("languages") || [];
    let updatedLanguages = currentLanguages.filter((lang) => lang !== key);

    setValue("languages", updatedLanguages);
  };

  return (
    <div>
      {" "}
      <div className="dashboard-header">
        <h3>Profile Settings</h3>
      </div>
      <div className="setting-title">
        <h5>Profile</h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="setting-card">
          <div className="change-avatar img-upload">
            <div className="profile-img">
              {doctorDetails?.coverImage ? (
                <img src={doctorDetails?.coverImage} alt="User Image" />
              ) : (
                <Image />
              )}
            </div>
            <div className="upload-img">
              <h5>Profile Image</h5>
              <div className="imgs-load d-flex align-items-center">
                <div className="change-photo">
                  Upload New
                  <input type="file" className="upload" />
                </div>
                <Link to="#" className="upload-remove">
                  Remove
                </Link>
              </div>
              <p className="form-text">
                Your Image should Below 4 MB, Accepted format jpg,png,svg
              </p>
            </div>
          </div>
        </div>
        <div className="setting-title">
          <h5>Information</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="First Name"
                    />
                  )}
                />
                <p className="text-danger">{errors?.firstName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Last Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.lastName?.message}</p>{" "}
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Display Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Display Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.displayName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Designation <span className="text-danger">*</span>
                </label>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Designation"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.designation?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Phone Numbers <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Phone number"
                    />
                  )}
                />
                <p className="text-danger">{errors.phoneNumber?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.email?.message}</p>
              </div>
            </Col>
            <Col lg="12" md="12">
              <div className="form-wrap">
                <label className="col-form-label">
                  Known Languages <span className="text-danger">*</span>
                </label>
                <div className="input-block input-block-new mb-0">
                  <div className="bootstrap-tagsinput">
                    {watch("languages")?.length > 0 ? (
                      watch("languages").map((language) => (
                        <span key={language} className="me-2">
                          <Badge pill bg="info">
                            {language}
                            <span
                              className="ms-2 cursor-pointer"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemove(language)}
                            >
                              X
                            </span>
                          </Badge>
                        </span>
                      ))
                    ) : (
                      <span className="text-align-start d-flex justify-content-start pt-2">
                        Select languages
                      </span>
                    )}
                    <span className="text-align-end d-flex justify-content-end pt-2">
                      {!listOpen ? (
                        <ChevronDown
                          onClick={() => setListOpen(true)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <ChevronUp
                          onClick={() => setListOpen(false)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </span>
                  </div>
                  {listOpen && (
                    <select
                      multiple
                      onChange={handleSelect}
                      className="form-control mt-2"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {LanguagesList?.map((language) => (
                        <option
                          key={language.code}
                          value={language.name}
                          style={{
                            background: watch("languages")?.includes(
                              language.name
                            )
                              ? "skyblue"
                              : "white",
                          }}
                        >
                          {language.name} - {language.localName} (
                          {language.code})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-danger">{errors.languages?.message}</p>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button className="px-5 save-btn mt-3 btn btn-primary">
                  Save {loading && <Spinner />}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
};

export default Profile;
