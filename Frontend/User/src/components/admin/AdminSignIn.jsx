import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminLoginSuccess } from "../../redux/reducers/authSlice";
import { BASE_URL } from "../../../config";
import { useDispatch } from "react-redux";

function AdminSignIn() {
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
      setError("Please enter both email and password and must not contain space");
      return;
    }

    axios
      .post(`${BASE_URL}/admin/login`, {
        email: email.current.value,
        password: password.current.value,
      })
      .then((res) => {
        const token = res.data.token;
        console.log(res);
        alert("Login Success");
        dispatch(adminLoginSuccess(token));
        localStorage.setItem("adminToken", token);
        navigate("/admin/categories");
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSignin}>
      <div className="border text-sm shadow-2xl max-w-[424px]  bg-white flex flex-col mx-auto p-8 gap-6 my-36">
        <div className="flex justify-center text-2xl">
          <h3>Admin Sign in </h3>
        </div>
        <p>Email Address</p>
        <input ref={email} className="h-12 border-2 pl-2" type="email" />
        <div className="flex justify-between">
          <p>Password</p>
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

export default AdminSignIn;
