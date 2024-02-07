import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

function EmailVerification(props) {
  const navigate = useNavigate();
  const otp = useRef();
  const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [isResendRequested, setIsResendRequested] = useState(false);

  const handleVerify = () => {
    const otpValue = otp.current.value;
    console.log(props.email, props.username, props.password, otpValue);
    if (props?.resetPassword) {
      const result = axios
        .post(`${BASE_URL}/user/reset-password`, {
          email: props.email,
          username: props.username,
          password: props.password,
          otp: otpValue,
        })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          navigate("/user/signin");
        })
        .catch((res) => {
          console.log(res);
          alert(res.response.data.message);
        });
    } else {
      const result = axios
        .post(`${BASE_URL}/user/verify-otp`, {
          email: props.email,
          username: props.username,
          password: props.password,
          otp: otpValue,
        })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          navigate("/user/signin");
        })
        .catch((res) => {
          console.log(res);
          alert(res.response.data.message);
        });
    }
  };

  const handleResendCode = () => {
    setIsResendRequested(true);
    const otpValue = otp.current.value;
    const result = axios
      .post(`${BASE_URL}/resend-otp`, {
        email: props.email,
      })
      .then((res) => {
        // Set the timer only after the code is sent
        const countdown = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              clearInterval(countdown);
              setIsTimerExpired(true);
              setIsResendRequested(false);
              return 0;
            }
          });
        }, 1000);

        const result = axios
          .post(`${BASE_URL}/verify-otp`, {
            email: props.email,
            username: props.username,
            password: props.password,
            otp: otpValue,
          })
          .then((res) => {
            console.log(res);
            alert(res.message);
            navigate("/user/signin");
          })
          .catch((res) => {
            console.log(res);
            alert(res.message);
          });
      });
    // Reset the timer if needed
    setTimer(120);
    setIsTimerExpired(false);
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdown);
          setIsTimerExpired(true);
          setIsResendRequested(false);
          return 0;
        }
      });
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(countdown);
  }, []);

  return (
    <>
      <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-32">
        <h2 className="text-center text-lg font-medium">Verify Your Email Address</h2>
        <p className="text-center text-gray-600">Enter the code sent to your email account</p>
        <div className="flex justify-between mt-4">
          <p className="font-medium">Verification Code</p>
          <button onClick={() => handleResendCode()} className={` font-semibold ${!isTimerExpired ? "text-gray-400" : "text-blue-500"}`} disabled={!isTimerExpired}>
            Resend Code
          </button>
        </div>
        <input ref={otp} className="h-12 border-2 pl-2" type="text" disabled={isTimerExpired} />
        <button onClick={() => handleVerify()} className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-4 mb-2" disabled={isTimerExpired}>
          VERIFY ME
        </button>
        {isTimerExpired ? (
          <p className="text-center text-gray-600">Timer Expired. Resend Code is enabled.</p>
        ) : (
          <p className="text-center text-gray-600">
            Time remaining: {Math.floor(timer / 60)}:{timer % 60}
          </p>
        )}
      </div>
    </>
  );
}

export default EmailVerification;
