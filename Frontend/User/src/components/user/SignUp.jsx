import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig.js";
import EmailVerification from "./EmailVerification.jsx";
import { showAlert } from "../../utils/sweetAlert";

function SignUp() {
  const navigate = useNavigate();
  const email = useRef();
  const username = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const [isOtpSend, setIsOtpSend] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    const emailValue = email.current.value;
    console.log(email.current.value);

    const usernameValue = username.current.value;
    if (!usernameValue || usernameValue.trim() === "" || usernameValue.length > 15) {
      showAlert("error", "Please enter a valid username and it can't contain more than 15 characters");
      return;
    }

    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showAlert("error", "Please enter a valid email address");
      return;
    }
    const passwordValue = password.current.value;

    if (!passwordValue && passwordValue.length < 8) {
      showAlert("error", "Password must be at least 8 characters long and it must not be empty");
      return;
    }

    const confirmPasswordValue = confirmPassword.current.value;
    if (passwordValue !== confirmPasswordValue) {
      showAlert("error", "Passwords do not match");
      return;
    }

    const result = axiosInstance
      .post(`/user/registration`, {
        email: emailValue,
      })
      .then((response) => {
        console.log(response.message);
        setIsOtpSend(true);
      })
      .catch((res) => {
        console.log(res.response.data.message);
        showAlert("error", res.response.data.message);
      });
  };

  return (
    <div>
      {isOtpSend ? (
        <EmailVerification email={email.current.value} username={username.current.value} password={password.current.value} />
      ) : (
        <form onSubmit={handleSignup}>
          <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-4 my-16">
            <div className="flex justify-between">
              <div onClick={() => navigate("/user/signin")} className="w-full pb-4 text-center cursor-pointer">
                Sign In
              </div>
              <div className="w-full border-b-4 border-orange-400 pb-4 text-center">Sign Up</div>
            </div>
            <p>Name</p>
            <input ref={username} className="h-12 border-2 pl-2" type="text" />
            <p>Email Address</p>
            <input ref={email} className="h-12 border-2 pl-2" type="text" />
            <p>Password</p>
            <input ref={password} className="h-12 border-2 pl-2" type="password" />
            <p>Confirm Password</p>
            <input ref={confirmPassword} className="h-12 border-2 pl-2" type="password" />
            <button type="submit" className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-2">
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
