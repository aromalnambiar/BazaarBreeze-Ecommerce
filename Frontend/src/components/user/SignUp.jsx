import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config.js";
import axios from "axios";
import EmailVerification from "./EmailVerification.jsx";

function SignUp() {
  const navigate = useNavigate();
  const email = useRef();
  const username = useRef();
  const password = useRef();
  const [isOtpSend, setIsOtpSend] = useState(false);

  const handleSignup = () => {
    const emailValue = email.current.value;
    console.log(email.current.value);
    const result = axios
      .post(`${BASE_URL}/user/registration`, {
        email: emailValue,
      })
      .then((response) => {
        console.log(response.message);
        setIsOtpSend(true);
      })
      .catch((res) => {
        alert(res);
      });
  };
  useEffect(() => {}, []);

  return (
    <div>
       
      {isOtpSend ? (
        <EmailVerification email={email.current.value} username={username.current.value} password={password.current.value} />
      ) : (
        <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-4 my-16">
          <div className="flex justify-between">
            <button onClick={() => navigate("/user/signin")} className="w-full pb-4">
              Sign In
            </button>
            <button className="w-full border-b-4 border-orange-400 pb-4">Sign Up</button>
          </div>
          <p>Name</p>
          <input ref={username} className="h-12 border-2 pl-2" type="text" />
          <p>Email Address</p>
          <input ref={email} className="h-12 border-2 pl-2" type="text" />
          <p>Password</p>
          <input ref={password} className="h-12 border-2 pl-2" type="password" />
          <p>Confirm Password</p>
          <input className="h-12 border-2 pl-2" type="password" />
          <button onClick={() => handleSignup()} className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-2">
            SIGN UP
          </button>
          <p onClick={() => navigate("/user/signin")} className="text-center">
            Already have an account? <span className="text-blue-500 cursor-pointer">Sign in</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default SignUp;
