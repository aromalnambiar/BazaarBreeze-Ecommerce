import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerification from "./EmailVerification";

function ResetPassword(props) {
  const navigate = useNavigate();
  const password = useRef("");
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {

    setIsClicked(true);
  };

  return (
    <>
      {isClicked ? (
        <EmailVerification password={password.current.value} username={props.username} email={props.email} />
      ) : (
        <div className="border text-sm shadow-2xl max-w-[424px] flex flex-col mx-auto p-8 gap-4 my-32">
          <h2 className="text-center text-lg font-medium">Reset Password</h2>
          <p className="text-center text-gray-600 mb-4">Enter the code sent to your email account</p>
          <p>Password</p>
          <input className="h-12 border-2 pl-2" type="text" />
          <p>Confirm Password</p>
          <input ref={password} className="h-12 border-2 pl-2" type="text" />
          <button onClick={() => handleClick()} className="bg-[#FA8232] text-white py-3 rounded-sm text-sm mt-4 mb-2">
            RESET PASSWORD
          </button>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
