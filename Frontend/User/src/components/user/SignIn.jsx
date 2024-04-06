import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { loginSuccess } from "../../redux/reducers/authSlice";
import axiosInstance from "../../utils/axiosConfig";
import { showAlert } from "../../utils/sweetAlert";
import { signinSchema } from "../../schemas/signinSchema";
import LoadingSpinner from "../common/LoadingSpinner";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signinSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axiosInstance.post(`/user/login`, {
          email: values.email,
          password: values.password,
        });
        const token = response.data.token;
        dispatch(loginSuccess(token));
        localStorage.setItem("token", token);
        navigate("/", { replace: true });
      } catch (error) {
        console.log(error.response.data.message);
        showAlert("error", error.response.data.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-16">
        <div className="flex justify-between">
          <div className="w-full border-b-4 border-orange-400 pb-4 text-center">Sign In</div>
          <div onClick={() => navigate("/user/signup")} className="w-full pb-4 cursor-pointer text-center">
            Sign Up
          </div>
        </div>
        <p>Email Address</p>
        <input name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className="h-12 border-2 pl-2" type="email" />
        {formik.errors.email && formik.touched.email && <p className="text-red-500 ">{formik.errors.email}</p>}
        <div className="flex justify-between">
          <p>Password</p>
          <p onClick={() => navigate("/user/forget-password")} className="text-[#2DA5F3] font-semibold cursor-pointer">
            Forget Password
          </p>
        </div>
        <input name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className="h-12 border-2 pl-2" type="password" />
        {formik.errors.password && formik.touched.password && <p className="text-red-500 ">{formik.errors.password}</p>}
        {/* <button type="submit" className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-10">
          SIGN IN
        </button> */}
        <button type="submit" className="bg-[#FA8232] text-white flex justify-center py-3 rounded-sm text-sm mt-8 mb-10" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <LoadingSpinner /> : "SIGN IN"}
        </button>
      </div>
    </form>
  );
}

export default SignIn;
