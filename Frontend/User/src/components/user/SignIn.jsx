import { useRef, useState } from "react";
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
  const [error, setError] = useState(null);

  const handleSignin = (e) => {
    e.preventDefault();
    if (email.current.value.trim() == "" || password.current.value.trim() == "") {
      return alert("Fill the fields");
    }
    if (!email.current.value || !password.current.value) {
      setError("Please enter both email and password");
      return;
    }

    axios
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
        localStorage.setItem("userId", userId);
        // console.log("navigating : /")
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSignin}>
      <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-6 my-16">
        <div className="flex justify-between">
          <div className="w-full border-b-4 border-orange-400 pb-4 text-center">Sign In</div>
          <div onClick={() => navigate("/user/signup")} className="w-full pb-4 cursor-pointer text-center">
            Sign Up
          </div>
        </div>
        <p>Email Address</p>
        <input ref={email} className="h-12 border-2 pl-2" type="email" />
        <div className="flex justify-between">
          <p>Password</p>
          <p onClick={() => navigate("/user/forget-password")} className="text-[#2DA5F3] font-semibold cursor-pointer">
            Forget Password
          </p>
        </div>
        <input ref={password} className="h-12 border-2 pl-2" type="password" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-8 mb-10">
          SIGN IN
        </button>
      </div>
    </form>
  );
}

export default SignIn;
