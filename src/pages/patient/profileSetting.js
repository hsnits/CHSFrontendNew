import React, { useEffect, useState } from "react";
import { Tab } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updatePatientProfile } from "../../redux/slices/patientApi";
import {
  changeProfilePic,
  uploadFile,
  userProfile,
} from "../../redux/slices/userApi";
import { useDispatch } from "react-redux";
import { callDeleteApi, callPostApi, callPutApi } from "../../_service";
import DeleteModal from "../../components/modals/delete-modal";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  birthDate: yup.date().required("Date of Birth is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  bloodGroup: yup.string().required("Blood Group is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  pinCode: yup.string().required("Pincode is required"),
});

const ProfileSetting = ({ data }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState({ is: false, id: null });

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data?.profile || {},
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("No file selected.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG or PNG).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("File size exceeds the 4MB limit.");
      return;
    }

    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) {
        throw new Error("Invalid response from server.");
      }

      const updateRes = await callPutApi(`/user/update/${data._id}`, {
        coverImage: res.data.location,
        fileKey: res.data.key,
      });
      console.log(updateRes);
      if (updateRes?.status) {
        dispatch(userProfile());
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    }
  };

  const handleRemove = async (e) => {
    try {
      const updateRes = await callDeleteApi(`/user/delete-dp/${data._id}`);
      console.log(updateRes, "updateRes");
      if (updateRes?.status) {
        setIsOpen({ is: false, id: null });
        setSelectedFile(null);
        dispatch(userProfile());
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    }
  };

  useEffect(() => {
    if (data?.profile) {
      reset(data?.profile);
    }
  }, [data, reset]);

  const onSubmit = async (value) => {
    const formattedData = {
      ...value,
      id: data._id,
      birthDate: value.birthDate
        ? new Date(value.birthDate).toISOString().split("T")[0]
        : null,
    };
    await dispatch(updatePatientProfile(formattedData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") dispatch(userProfile());
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="setting-card">
          <div className="change-avatar img-upload">
            <div className="profile-img">
              {data?.coverImage ? (
                <img src={data?.coverImage} alt="Profile Preview" />
              ) : selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Profile Preview"
                />
              ) : (
                <i className="fa-solid fa-file-image"></i>
              )}
            </div>
            <div className="upload-img">
              <h5>Profile Image</h5>
              <div className="imgs-load d-flex align-items-center">
                <div className="change-photo" style={{ cursor: "pointer" }}>
                  Upload New
                  <input
                    style={{ cursor: "pointer" }}
                    type="file"
                    className="upload hover-pointer"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsOpen({ is: true })}
                  className="upload-remove hover-pointer"
                >
                  Remove
                </div>
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
          <div className="row">
            <div className="col-lg-4 col-md-6">
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
                <p className="text-danger">{errors.firstName?.message}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.lastName?.message}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="date" className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.birthDate?.message}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.phoneNumber?.message}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input {...field} type="email" className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.email?.message}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Blood Group <span className="text-danger">*</span>
                </label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.bloodGroup?.message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-title">
          <h5>Address</h5>
        </div>
        <div className="setting-card">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-wrap">
                <label className="col-form-label">
                  Address <span className="text-danger">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.address?.message}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  City <span className="text-danger">*</span>
                </label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.city?.message}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  State <span className="text-danger">*</span>
                </label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.state?.message}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Country <span className="text-danger">*</span>
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.country?.message}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Pincode <span className="text-danger">*</span>
                </label>
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="form-control" />
                  )}
                />
                <p className="text-danger">{errors.pinCode?.message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-btn text-end">
          <a href="#" className="btn btn-gray">
            Cancel
          </a>
          <button type="submit" className="btn btn-primary prime-btn">
            Save Changes
          </button>
        </div>
      </form>
      <DeleteModal
        type="profile"
        isOpen={isOpen?.is}
        onClose={() => setIsOpen({ is: false, id: null })}
        title="Are you sure you want to remove this profile picture ?"
        onConfirm={handleRemove}
      />
    </>
  );
};

export default ProfileSetting;
