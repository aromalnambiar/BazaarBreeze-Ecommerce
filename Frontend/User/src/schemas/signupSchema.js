import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

export const signupSchema = yup.object().shape({
 username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username can't be longer than 15 characters"),
 email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required")
    .test(
      "is-valid-email",
      "Please enter a valid email",
      function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
    ),
 password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(passwordRules, "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and be at least 5 characters long")
    .required("Password is required"),
 confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
