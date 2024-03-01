import { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { BASE_URL } from "../../config";

function AdminSignIn() {
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSignin = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/admin/login`, {
        email: email.current.value,
        password: password.current.value,
      })
      .then((res) => {
        const { token } = res.data;
        login(token);
        // console.log(res);
        // alert("Login Success");
        window.location.href = "/adminpanel/dashboard";
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-tr from-gray-700 to-indigo-600 absolute top-0 left-0 z-50 ">
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
    </div>
  );
}

export default AdminSignIn;
