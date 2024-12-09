export const ENDPOINTS = {
  USER: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    UPDATE_PROFILE: "/user/update",
    CHANGE_PROFILE_PICTURE: "/user/change-dp",
    VERIFY_EMAIL: "/user/verify-email",
    GET_PROFILE: "/user",
    FORGOT_PASSWORD: "/user/forgot-password",
    UPLOAD_FILE: "/user/upload-file",
  },
  PATIENT: {
    UPDATE_PROFILE: "/patient",
    CREATE_APPOINTMENT: "/patient/appointment",
    GET_APPOINTMENT: "/patient/appointment/single",
    UPDATE_APPOINTMENT: "/patient/appointment",
    GET_ALL_APPOINTMENT: "/patient/appointment",
  },
  DOCTOR: {
    GET_DOCTORS: "/doctor/list",
  },
};
