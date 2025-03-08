import { userRoles } from "../../constants/auth";
import * as yup from "yup";

const registrationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  phoneNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[0-9]+$/, "Mobile Number must only contain digits")
    .min(10, "Mobile Number must be exactly 10 digits")
    .max(15, "Mobile Number must not exceed 15 digits"),
  email: yup
    .string()
    .email("Email Address must be valid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must not exceed 100 characters"),
  role: yup
    .string()
    .required("Role is required")
    .oneOf(userRoles, "Invalid role selected"),
});

const loginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const verifySchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits"),
});

const forgotSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
});

const resetSchema = yup.object().shape({
  code: yup
    .string()
    .required("OTP is required.")
    .min(4, "OTP must be at least 4 digits.")
    .max(6, "OTP must not exceed 6 digits."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters long."),
  confirmPassword: yup
    .string()
    .required("Confirm password is required.")
    .oneOf(
      [yup.ref("password"), null],
      "Confirm password must match the password."
    ),
});

export {
  registrationSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
  verifySchema,
};
