import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";

const Modal = ({ isOpen, onClose, children }) => {
  const [coupons, setCoupons] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  // Add event listener for the 'Escape' key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/user/coupon`);
        console.log("result : ", result.data);
        setCoupons(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen]);

  // Close the modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);

    // Reset the copied state after a delay
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOutsideClick}>
          <div className="bg-white p-6 w-full max-w-[720px] rounded-md shadow-md">
            {/* {children} */}
            {coupons.map((item, idx) => {
              return (
                <div key={item._id} className="border mx-8 rounded-md p-4 my-2">
                  <h3>CouponName : {item.couponName}</h3>
                  <p>CouponDescription : {item.description}</p>
                  <h3>
                    CouponCode : <span className="font-bold">{item.code}</span>
                  </h3>
                  <button className={`mt-2 px-4 py-2 bg-white  rounded-md  focus:outline-none focus:ring focus:border-blue-300 ${copiedIndex === idx ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => handleCopyCode(item.code, idx)} disabled={copiedIndex === idx}>
                    {copiedIndex === idx ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              );
            })}
            <button className="mt-4 ml-[40px] px-4 py-2 bg-blue-500 text-white rounded-md " onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
