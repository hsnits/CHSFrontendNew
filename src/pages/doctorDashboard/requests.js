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
  } = useGetMountData(`/doctor/appointment/${userProfileId}`);

  const getByFilter = async (time, startDate, endDate) => {
    if (time) {
      setQuery((e) => ({ ...e, status: "Pending", time: time }));
    }
    // let url = `/doctor/appointment/${userProfileId}?status=Pending&time=${time}`;
    if (startDate && endDate) {
      setQuery((e) => ({
        ...e,
        status: "Pending",
        startDate: startDate,
        endDate: endDate,
      }));
      // url = `/doctor/appointment/${userProfileId}?status=Pending&time=${time}&startDate=${startDate}&endDate=${endDate}`;
    }
    // await getAllData(url);
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
    console.log(dates, "ffff");
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
      getAllData(`/doctor/appointment/${userProfileId}`);
    }
  }, [activeKey, userProfileId]);

  console.log(Appointments, "Appointments");
  return (
    <div>
      <div class="dashboard-header">
        <h3>Requests</h3>

        <div className="flex justify-between mr-1 ">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            isClearable
            className=" border rounded p-2  w-full h-full "
            placeholderText="Select a date range"
          />

          {/* {startDate && endDate && (
            <p className="text-sm">
              Selected Range: {startDate.toLocaleDateString()} -{" "}
              {endDate.toLocaleDateString()}
            </p>
          )} */}

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
            <div class="appointment-wrap">
              <ul>
                <li>
                  <div class="patinet-information">
                    <a href="#">
                      <img
                        src={it?.patientId?.coverImage || user_img}
                        alt="User Image"
                      />
                    </a>
                    <div class="patient-info">
                      <p>{getIdLastDigits(it?._id, "PT")}</p>
                      <h6>
                        <a href="#">
                          {" "}
                          {it?.appointmentPersonName ||
                            formatName(it?.patientId, "Pt")}
                        </a>
                        {/* <span class="badge new-tag">New</span> */}
                      </h6>
                    </div>
                  </div>
                </li>
                <li class="appointment-info">
                  <p>
                    <i class="fa-solid fa-clock"></i>
                    {`${getDateFormate(it?.date)} ${it?.time}`}
                  </p>
                  <p class="md-text">General Visit</p>
                </li>
                <li class="appointment-type">
                  <p class="md-text">Type of Appointment</p>
                  <p>
                    <i class="fa-solid fa-video text-blue"></i>{" "}
                    {it?.appointmentType || "General"}
                  </p>
                </li>
                <li>
                  <ul class="request-action">
                    <li>
                      <span
                        onClick={() => handleUpdate(it?._id, "Accepted")}
                        class="accept-link "
                        style={{ cursor: "pointer" }}
                      >
                        <i class="fa-solid fa-check text-green"></i> Accept
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => openModelWithItem("delete", it)}
                        class="reject-link"
                        style={{ cursor: "pointer" }}
                      >
                        <i class="fa-solid fa-xmark text-danger"></i> Reject
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
        title="Are you sure you want to cancel this appointment request ?"
        onConfirm={() => handleUpdate(customData?._id, "Cancelled")}
      />
    </div>
  );
};

export default Requests;
