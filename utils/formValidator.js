import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
  .string()
  .email("Fill the empty field")
  .required("Email is required")
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"),
  password: yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must contain at least one letter and one number"),
});

export const signUpSchema = yup.object().shape({
  fullName: yup.string().required("First name is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9][0-9]{7,14}$/, "Phone number is invalid")
    .required("Phone number is required"),
    password: yup
    .string()
   
    .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string()
    .email("Invalid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid")
    .required("Email is required"),
});
