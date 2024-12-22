import React from "react";
import { Spinner } from "reactstrap";

const NotFound = ({
  isData = true,
  message = "Data not Found!",
  className = "flex justify-center w-full my-2 text-base text-black px-4",
  loading = false,
  loaderSize = "sm",
  loaderType = "border",
  loaderColor = "primary",
  loaderLabel = "Loading...",
}) => {
  if (loading) {
    return (
      <div
        className="flex flex-1 justify-center items-center"
        style={{ height: "70vh" }}
      >
        <span style={{ color: "black", marginInline: 3 }}>{loaderLabel}</span>
        <Spinner size={loaderSize} color={loaderColor} type={loaderType} />
      </div>
    );
  }

  if (!isData) {
    return (
      <div
        style={{ height: "70vh" }}
        className="flex justify-center items-center"
      >
        <h5 className={className}>{message}</h5>
      </div>
    );
  }

  return null;
};

export default NotFound;
