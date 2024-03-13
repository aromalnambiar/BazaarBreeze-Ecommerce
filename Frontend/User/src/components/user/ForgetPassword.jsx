import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../../config";
import ResetPassword from "./ResetPassword";
import axiosInstance from "../../utils/axiosConfig";
import { setUser } from "../../redux/reducers/userSlice";

function ForgetPassword() {
  const navigate = useNavigate();
  const email = useRef();
  const [username, setUsername] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);

  const handleSubmit = () => {
    const result = axiosInstance
      .post(`/user/forget-password`, {
        email: email.current.value,
      })
      .then((res) => {
        console.log(res);
        setUsername(res.data.username);
        // <EmailVerification email={email.current.value} username={username.current.value} password={password.current.value} />
        setIsOtpSend(true);
      })
      .catch((res) => {
        console.log(res.response.data.message);
        alert(res.response.data.message);
      });
  };
  return (
    <>
      {isOtpSend ? (
        <ResetPassword email={email.current.value} username={username} />
      ) : (
        <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-16">
          <h2 className="text-center text-lg font-bold">Forget Password</h2>
          <p className="text-center text-gray-600">Enter the email address associated with your Ecommerce account.</p>
          <p className="font-semibold">Email Address</p>
          <input ref={email} className="h-12 border-2 pl-2" type="email" required />
          <button onClick={() => handleSubmit()} className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-4 mb-2">
            SEND CODE
          </button>
          <p onClick={() => navigate("/user/signin")}>
            Already have an account ? <span className="cursor-pointer text-blue-500 font-semibold">Sign in</span>
          </p>
          <p onClick={() => navigate("/user/signup")}>
            Don't have an account ? <span className="cursor-pointer text-blue-500 font-semibold">Sign up</span>
          </p>
        </div>
      )}
    </>
  );
}

export default ForgetPassword;
