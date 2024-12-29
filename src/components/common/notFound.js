import React from "react";
import { Spinner } from "reactstrap";
import noDataImg from "../../assets/images/noDataFound2.png";

const NotFound = ({
  isData = true,
  message = "Data not Found!",
  className = "flex justify-center w-full my-2 text-base text-black px-4",
  loading = false,
  loaderSize = "sm",
  loaderType = "border",
  loaderColor = "primary",
  loaderLabel = "Loading...",
  height = "70vh",
}) => {
  if (loading) {
    return (
      <div
        className="flex flex-1 justify-center items-center"
        style={{ height: height }}
      >
        <span style={{ color: "black", marginInline: 3 }}>{loaderLabel}</span>
        <Spinner size={loaderSize} color={loaderColor} type={loaderType} />
      </div>
    );
  }

  if (!isData) {
    return (
      <div
        style={{ height: height }}
        className="flex flex-col justify-center items-center"
      >
        <div className="mb-2">
          {" "}
          <img src={noDataImg} alt="noData" />
        </div>
        <h5 className={`text-center ${className}`}>{message}</h5>{" "}
      </div>
    );
  }

  return null;
};

export default NotFound;
