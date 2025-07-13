// File: pages/pathologyDashboard/profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Badge, Col, Row } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "reactstrap";
import { useDispatch } from "react-redux";

import { callDeleteApi, callPostApi } from "../../_service";
import { updatePathologyLabProfile } from "../../redux/slices/pathologyApi";
import { toastMessage } from "../../config/toast";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import { LanguagesList } from "../../constants/common";
import { userProfile } from "../../redux/slices/userApi";
import DeleteModal from "../../components/modals/delete-modal";

const schema = yup.object().shape({
  firstName: yup.string().required("Contact Person First Name is required"),
  lastName: yup.string().required("Contact Person Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email"),
  designation: yup.string().required("Lab Role/Designation is required"),
  languages: yup
    .array()
    .required("Languages are required.")
    .min(1, "Please select at least one language."),
});

const Profile = ({ getAllData, labDetails }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [listOpen, setListOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState({ is: false, id: null });

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
    defaultValues: labDetails?.profile || {},
  });

  const handlePhotoChange = async (e) => {
    console.log("handlePhotoChange triggered", e.target.files);
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return toastMessage("error", "No file selected.");
    }
    
    console.log("File selected:", file.name, file.type, file.size);
    
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
      return toastMessage("error", "Only JPEG, JPG, PNG allowed.");
    if (file.size > 4 * 1024 * 1024)
      return toastMessage("error", "Max 4MB image allowed.");

    setSelectedFile(file);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) throw new Error("Invalid file upload response");

      const resultAction = await dispatch(updatePathologyLabProfile({
        userId: labDetails?._id,
        coverImage: res.data.location,
        fileKey: res.data.key,
      }));

      if (updatePathologyLabProfile.fulfilled.match(resultAction)) {
        getAllData("/user");
        dispatch(userProfile());
        toastMessage("success", "Profile photo updated successfully");
      } else {
        throw new Error(resultAction.payload || "Failed to update profile photo");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toastMessage("error", "File upload failed");
      setLoading(false);
    }
  };

  const handleProfileRemove = async () => {
    try {
      setLoading(true);
      
      // Update profile to remove cover image
      const resultAction = await dispatch(updatePathologyLabProfile({
        userId: labDetails?._id,
        coverImage: null,
        fileKey: null,
      }));

      if (updatePathologyLabProfile.fulfilled.match(resultAction)) {
        setIsOpen({ is: false, id: null });
        setSelectedFile(null);
        getAllData("/user");
        dispatch(userProfile());
        toastMessage("success", "Profile photo removed successfully");
      } else {
        throw new Error(resultAction.payload || "Failed to remove profile photo");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastMessage("error", "Failed to remove profile photo");
    }
  };

  const onSubmit = async (data) => {
    console.log("Form submit data:", data);
    console.log("labDetails:", labDetails);
    
    const updatedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      designation: data.designation,
      phoneNumber: data.phoneNumber,
      email: data.email,
      languages: data.languages,
    };

    try {
      setLoading(true);
      
      const resultAction = await dispatch(updatePathologyLabProfile({
        userId: labDetails?._id,
        ...updatedData
      }));

      if (updatePathologyLabProfile.fulfilled.match(resultAction)) {
        toastMessage("success", "Lab profile updated successfully");
        await getAllData("/user");

        const userProfile = getLocalStorage(STORAGE.USER_KEY);
        let profile = userProfile.profile;

        setLocalStorage(STORAGE.USER_KEY, {
          ...userProfile,
          name: updatedData.firstName,
          phoneNumber: updatedData.phoneNumber,
          email: updatedData.email,
          profile: { ...profile, ...updatedData },
        });
      } else {
        throw new Error(resultAction.payload || "Profile update failed");
      }

      setLoading(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setLoading(false);
      toastMessage("error", error.message || "Profile update failed");
    }
  };

  useEffect(() => {
    if (labDetails?.profile) {
      reset(labDetails?.profile);
    }
  }, [labDetails, reset]);

  // Debug logging
  useEffect(() => {
    console.log("Profile component - labDetails:", labDetails);
  }, [labDetails]);

  const handleSelect = (e) => {
    const lang = e.target.value;
    const current = watch("languages") || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setValue("languages", updated);
    setError("languages", null);
  };

  const handleRemove = (lang) => {
    const current = watch("languages") || [];
    setValue("languages", current.filter((l) => l !== lang));
  };

  return (
    <div>
      <div className="dashboard-header"><h3>Lab Profile Settings</h3></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="setting-title"><h5>Profile Image</h5></div>
        <div className="setting-card">
          <div className="change-avatar img-upload">
            <div className="profile-img">
              {selectedFile ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
              ) : labDetails?.profile?.coverImage ? (
                <img src={labDetails.profile.coverImage} alt="Preview" />
              ) : labDetails?.coverImage ? (
                <img src={labDetails.coverImage} alt="Preview" />
              ) : (
                <i className="fa-solid fa-file-image"></i>
              )}
            </div>
            <div className="upload-img">
              <h5>Upload New</h5>
              <div className="imgs-load d-flex align-items-center">
                <div className="change-photo">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="profile-image-upload"
                    className="upload"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handlePhotoChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="profile-image-upload"
                    className="upload-btn"
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? "Uploading..." : "Choose File"}
                  </label>
                </div>
                <div
                  onClick={() => setIsOpen({ is: true })}
                  className="upload-remove"
                  style={{ cursor: "pointer" }}
                >
                  Remove
                </div>
              </div>
              <p className="form-text">Only JPG/PNG, Max 4MB.</p>
            </div>
          </div>
        </div>

        <div className="setting-title"><h5>Lab Information</h5></div>
        <div className="setting-card">
          <Row>
            {["firstName", "lastName", "designation", "phoneNumber", "email"].map((field, i) => (
              <Col lg="4" md="6" key={i}>
                <div className="form-wrap">
                  <label className="col-form-label text-capitalize">
                    {field === "firstName"
                      ? "Contact Person First Name"
                      : field === "lastName"
                      ? "Last Name"
                      : field === "designation"
                      ? "Lab Role/Designation"
                      : field === "phoneNumber"
                      ? "Phone Number"
                      : "Email"}
                    {["firstName", "lastName", "designation", "phoneNumber"].includes(field) && (
                      <span className="text-danger">*</span>
                    )}
                  </label>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field }) => (
                      <input {...field} className="form-control" placeholder={field.placeholder} />
                    )}
                  />
                  <p className="text-danger">{errors?.[field]?.message}</p>
                </div>
              </Col>
            ))}
            <Col lg="12">
              <div className="form-wrap">
                <label className="col-form-label">
                  Known Languages <span className="text-danger">*</span>
                </label>
                <div className="input-block input-block-new mb-0">
                  <div className="bootstrap-tagsinput">
                    {watch("languages")?.map((lang) => (
                      <Badge key={lang} bg="info" className="me-2">
                        {lang}
                        <span className="ms-2" onClick={() => handleRemove(lang)} style={{ cursor: "pointer" }}>x</span>
                      </Badge>
                    ))}
                    <span className="d-flex justify-content-end pt-2">
                      {!listOpen ? (
                        <ChevronDown onClick={() => setListOpen(true)} />
                      ) : (
                        <ChevronUp onClick={() => setListOpen(false)} />
                      )}
                    </span>
                  </div>
                  {listOpen && (
                    <select multiple onChange={handleSelect} className="form-control mt-2">
                      {LanguagesList?.map((lang) => (
                        <option key={lang.code} value={lang.name}>
                          {lang.name} - {lang.localName} ({lang.code})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-danger">{errors.languages?.message}</p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary px-5 mt-3" disabled={loading}>
              Save Changes {loading && <Spinner size="sm" />}
            </button>
          </div>
        </div>
      </form>

      <DeleteModal
        loading={loading}
        type="profile"
        isOpen={isOpen.is}
        onClose={() => setIsOpen({ is: false, id: null })}
        title="Are you sure you want to remove this profile picture?"
        onConfirm={handleProfileRemove}
      />
    </div>
  );
};

export default Profile;
