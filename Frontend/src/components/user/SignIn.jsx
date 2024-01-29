import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../../redux/reducers/authSlice";
import { BASE_URL } from "../../../config";
import { useDispatch } from "react-redux";

function SignIn() {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const dispatch = useDispatch();

  const handleSignin = () => {
    const result = axios
      .post(`${BASE_URL}/user/login`, {
        email: email.current.value,
        password: password.current.value,
      })
      .then((res) => {
        const token = res.data.token;
        const userId = res.data.userId;
        console.log(res);
        alert(res.data.message);
        dispatch(loginSuccess(token));
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((res) => {
        console.log(res);
        // alert(res.response.data.message);
      });
  };
  return (
    <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-16">
      <div className="flex justify-between">
        <button className="w-full border-b-4 border-orange-400 pb-4">Sign In</button>
        <button onClick={() => navigate("/user/signup")} className="w-full pb-4">
          Sign Up
        </button>
      </div>
      <p>Email Address</p>
      <input ref={email} className="h-12 border-2 pl-2" type="text" />
      <div className="flex justify-between">
        <p>Password</p>
        <p onClick={() => navigate("/user/forget-password")} className="text-[#2DA5F3] font-semibold cursor-pointer">
          Forget Password
        </p>
      </div>
      <input ref={password} className="h-12 border-2 pl-2" type="text" />
      <button onClick={() => handleSignin()} className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-10">
        SIGN IN
      </button>
    </div>
  );
}

export default SignIn;
