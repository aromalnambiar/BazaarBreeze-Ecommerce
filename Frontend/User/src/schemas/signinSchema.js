import * as yup from "yup";


export const signinSchema=yup.object().shape({
    email:yup
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
    password:yup
    .string()
    .min(8,"Password must be at least 8 characters long")
    .required("Password is required")
})