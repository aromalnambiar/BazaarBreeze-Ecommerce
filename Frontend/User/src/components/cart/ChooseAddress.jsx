import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

function ChooseAddress() {
  const [selectedAddress, setSelectedAddress] = useState({});
  const [address, setAddress] = useState([]);
  const navigate = useNavigate("");
  // console.log("cartItems chooseAddress : ", cartItems);
  const location = useLocation();
  // const data = location.state?.data;
  const data = location?.state;
  const grandTotal = data?.grandTotal;
  const cartItems = data?.cartItems;
  const couponId = data?.couponId;
  console.log("data from the navigate : ", grandTotal);
  useEffect(() => {
    axiosInstance
      .get(`/user/address`)
      .then((res) => {
        setAddress(res.data.addresses);
        setSelectedAddress(res.data.addresses[0]);
      })
      .catch((err) => {
        console.log("Err : ", err);
      });
  }, []);

  const handleRadioChange = (address) => {
    setSelectedAddress(address);
    // console.log("Selected Address:", address);
  };

  const handleDeliverClick = () => {
    navigate("/shop/checkout", { state: { grandTotal, cartItems, couponId, selectedAddress } });
  };

  return (
    <>
      <div className="grid grid-cols-12 py-16">
        <div className="col-span-12">
          <div className="bg-[#2874f0] p-4 ">
            <h3 className="text-white">Choose delivery address</h3>
          </div>
          {address.map((item) => {
            return (
              <label key={item?._id} className={`block border p-4 cursor-pointer ${selectedAddress === address ? "bg-blue-200" : ""}`}>
                <div className="flex items-center">
                  <input type="radio" id={`address_${item?._id}`} name="address" value={item?._id} checked={selectedAddress?._id === item?._id} onChange={() => handleRadioChange(item)} className="mr-2" />
                  <div>
                    <div className="flex">
                      <h3>{item?.fullName}</h3>
                      <p>{item?.phone1}</p>
                    </div>
                    <p>{item?.address}</p>
                  </div>
                </div>
                <button onClick={handleDeliverClick} className={`bg-[#fb641b] p-4 px-10 rounded-sm ml-8 mt-4 uppercase text-white text-sm ${selectedAddress?._id === item?._id ? "block" : "hidden"}`}>
                  Deliver Here
                </button>
              </label>
            );
          })}
          <div onClick={() => navigate("/dashboard")} className="w-full p-4 flex  items-center border text-[#2874f0] mt-4 cursor-pointer gap-4">
            <FaPlus />
            Add New Address
          </div>
        </div>
      </div>
    </>
  );
}

export default ChooseAddress;
