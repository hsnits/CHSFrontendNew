import React from "react";
import { Spinner } from "reactstrap";

const NotFound = ({
  isData,
  message,
  className,

  loading,
  loaderSize,
  loaderType,
  loaderColor,
  loaderLabel,
}) => {
  return (
    <div className="w-full text-center">
      {loading ? (
        <>
          <div className="flex flex-1 justify-center items-center">
            <span style={{ color: "black", marginInline: 3 }}>
              {loaderLabel || "Loading..."}
            </span>
            <Spinner
              size={loaderSize || "sm"}
              color={loaderColor || "primary"}
              type={loaderType || "border"}
            />
          </div>
        </>
      ) : !isData ? (
        <div
          className={
            className ||
            `flex justify-center w-full my-2 text-base text-black px-4`
          }
        >
          {message || "Data not Found !"}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotFound;
