import React, { useEffect, useState } from "react";
import user_img from "../../assets/img/dr_profile.jpg";
import useGetMountData from "../../helpers/getDataHook";
import { getLocalStorage } from "../../helpers/storage";
import { STORAGE } from "../../constants";
import {
  formatName,
  getDateFormate,
  getIdLastDigits,
} from "../../helpers/utils";
import NotFound from "../../components/common/notFound";
import { ChevronDown, ChevronUp } from "react-feather";
import { Dropdown, Form } from "react-bootstrap";
import { toastMessage } from "../../config/toast";
import { callPutApi } from "../../_service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteModal from "../../components/modals/delete-modal";

const Requests = ({ activeKey }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [time, setTime] = useState("");
  const [uploading, setUploading] = useState(false);

  const userProfileId = getLocalStorage(STORAGE.USER_KEY)?.profile?._id;

  const {
    data: Appointments,
    loading,
    getAllData,
    setData,
    setQuery,
    isOpen,
    openModelWithItem,
    customData,
  } = useGetMountData(`/nurse/appointment/${userProfileId}`);

  const getByFilter = async (time, startDate, endDate) => {
    if (time) {
      setQuery((e) => ({ ...e, status: "Pending", time: time }));
    }
    if (startDate && endDate) {
      setQuery((e) => ({
        ...e,
        status: "Pending",
        startDate: startDate,
        endDate: endDate,
      }));
    }
  };

  useEffect(() => {
    setQuery((e) => ({ ...e, status: "Pending" }));
  }, []);

  useEffect(() => {
    if (time || (startDate && endDate)) {
      getByFilter(time, startDate, endDate);
    }
  }, [startDate, endDate, time]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleUpdate = async (id, status) => {
    try {
      setUploading(true);
      const verifyResponse = await callPutApi(`/patient/appointment/${id}`, {
        status,
      });
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      openModelWithItem();
      setUploading(false);

      toastMessage(
        "success",
        status === "Accepted"
          ? "The appointment has been accepted."
          : "The appointment has been rejected."
      );

      const updatedData = Appointments?.filter((item) => item?._id !== id);
      setData(updatedData || []);
    } catch (error) {
      setUploading(false);
      toastMessage("error", "Appointment update process failed!");
    }
  };

  useEffect(() => {
    if (activeKey && userProfileId) {
      getAllData(`/nurse/appointment/${userProfileId}`);
    }
  }, [activeKey, userProfileId]);

  return (
    <div>
      <div className="dashboard-header">
        <h3>Appointment Requests</h3>
        <div className="flex justify-between mr-1">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            isClearable
            className="border rounded p-2 w-full h-full"
            placeholderText="Select a date range"
          />
          <ul>
            <li>
              <Form.Select
                onChange={(e) => {
                  setTime(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </Form.Select>
            </li>
          </ul>
        </div>
      </div>
      <NotFound
        loading={loading}
        isData={Appointments?.length > 0}
        message="No Appointment Requests Found."
      />
      {!loading &&
        Appointments?.length > 0 &&
        Appointments?.map((it, index) => {
          return (
            <div className="appointment-wrap" key={index}>
              <ul>
                <li>
                  <div className="patinet-information">
                    <img
                      src={it?.patientId?.coverImage || user_img}
                      alt="User Image"
                    />
                    <div className="patient-info">
                      <p>{getIdLastDigits(it?._id, "PT")}</p>
                      <h6>
                        <a href="#">
                          {it?.appointmentPersonName ||
                            formatName(it?.patientId, "Pt")}
                        </a>
                      </h6>
                    </div>
                  </div>
                </li>
                <li className="appointment-info">
                  <p>
                    <i className="fa-solid fa-clock"></i>
                    {`${getDateFormate(it?.date)} ${it?.time}`}
                  </p>
                  <p className="md-text">General Visit</p>
                </li>
                <li className="appointment-type">
                  <p className="md-text">Type of Appointment</p>
                  <p>
                    <i className="fa-solid fa-video text-blue"></i>{" "}
                    {it?.appointmentType || "General"}
                  </p>
                </li>
                <li>
                  <ul className="request-action">
                    <li>
                      <span
                        onClick={() => handleUpdate(it?._id, "Accepted")}
                        className="accept-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-check text-green"></i> Accept
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => openModelWithItem("delete", it)}
                        className="reject-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-xmark text-danger"></i> Reject
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        })}
      <DeleteModal
        loading={uploading}
        type="request"
        isOpen={isOpen == "delete"}
        onClose={openModelWithItem}
        title="Are you sure you want to reject this appointment request?"
        onConfirm={() => handleUpdate(customData?._id, "Rejected")}
      />
    </div>
  );
};

export default Requests;