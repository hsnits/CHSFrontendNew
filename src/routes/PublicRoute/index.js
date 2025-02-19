import React from "react";
import { Navigate } from "react-router-dom";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";

const PublicRoute = ({ children }) => {
  const user = getLocalStorage(STORAGE.USER_KEY);

  if (user?.accessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
