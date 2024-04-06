import { useFormik } from "formik";
import { signupSchema } from "../../schemas/signupSchema.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig.js";
import EmailVerification from "./EmailVerification.jsx";
import { showAlert } from "../../utils/sweetAlert";
import { useState } from "react";

function SignUp() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axiosInstance.post(`/user/registration`, {
          email: values.email,
        });
        console.log(response.message);
        setIsOtpSend(true);
      } catch (error) {
        console.log(error.response.data.message);
        showAlert("error", error.response.data.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [isOtpSend, setIsOtpSend] = useState(false);

  return (
    <div>
      {isOtpSend ? (
        <EmailVerification email={formik.values.email} username={formik.values.username} password={formik.values.password} />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-4 my-16">
            <div className="flex justify-between">
              <div onClick={() => navigate("/user/signin")} className="w-full pb-4 text-center cursor-pointer">
                Sign In
              </div>
              <div className="w-full border-b-4 border-orange-400 pb-4 text-center">Sign Up</div>
            </div>
            <p>Name</p>
            <input name="username" type="text" className="h-12 border-2 pl-2" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
            {formik.errors.username && formik.touched.username && <p className="text-red-500 ">{formik.errors.username}</p>}
            <p>Email Address</p>
            <input name="email" type="text" className="h-12 border-2 pl-2" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
            {formik.errors.email && formik.touched.email && <p className="text-red-500 ">{formik.errors.email}</p>}
            <p>Password</p>
            <input name="password" type="password" className="h-12 border-2 pl-2" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
            {formik.errors.password && formik.touched.password && <p className="text-red-500 ">{formik.errors.password}</p>}
            <p>Confirm Password</p>
            <input name="confirmPassword" type="password" className="h-12 border-2 pl-2" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className="text-red-500 ">{formik.errors.confirmPassword}</p>}
            <button type="submit" className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-2" disabled={formik.isSubmitting}>
              SIGN UP
            </button>
            <p onClick={() => navigate("/user/signin")} className="text-center">
              Already have an account? <span className="text-blue-500 cursor-pointer">Sign in</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default SignUp;
