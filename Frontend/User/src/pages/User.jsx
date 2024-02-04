import { Routes, Route } from "react-router-dom";
import SignIn from "../components/user/SignIn";
import SignUp from "../components/user/SignUp";
import ForgetPassword from "../components/user/ForgetPassword";
import ResetPassword from "../components/user/ResetPassword";
import EmailVerification from "../components/user/EmailVerification";

function User() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
      </Routes>
    </>
  );
}

export default User;
