import React from "react";

const ErrorInput = ({ error }) => {
  return (
    <div className="error-input">
      <p>{error}</p>
    </div>
  );
};

export default ErrorInput;
