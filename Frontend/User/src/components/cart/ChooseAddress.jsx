import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";
import Checkout from "../shop/Checkout";

function ChooseAddress({ grandTotal, cartItems }) {
  const [selectedAddress, setSelectedAddress] = useState({});
  const [address, setAddress] = useState([]);
  const navigate = useNavigate("");
  const [isDeliver, setIsDeliver] = useState(false);
  console.log("cartItems chooseAddress : ", cartItems);
  // const addresses = [
  //   {
  //     id: 1,
  //     name: "Sugunan",
  //     phone: "738293829",
  //     address: "kinfra kakkanchery, kakkanchery, MALAPPURAM, Kerala - 673634",
  //   },
  //   {
  //     id: 2,
  //     name: "Sugunan",
  //     phone: "738293829",
  //     address: "kinfra kakkanchery, kakkanchery, MALAPPURAM, Kerala - 673634",
  //   },

  //   // Add more addresses as needed
  // ];
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/address`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAddress(res.data.addresses);
        setSelectedAddress(address[0]);
      })
      .catch((err) => {
        console.log("Err : ", err);
      });
  }, []);

  const handleRadioChange = (address) => {
    setSelectedAddress(address);
    console.log("Selected Address:", address);
  };

  console.log("Address : ", address);

  return (
    <>
      {isDeliver ? (
        <Checkout address={selectedAddress} grandTotal={grandTotal} cartItems={cartItems} />
      ) : (
        <div className="grid grid-cols-12 py-16">
          <div className="col-span-12">
            <div className="bg-[#2874f0] p-4 ">
              <h3 className="text-white">Choose delivery address</h3>
            </div>
            {address.map((item) => {
              {
                console.log("Item : ", item);
              }
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
                  <button onClick={() => setIsDeliver(true)} className={`bg-[#fb641b] p-4 px-10 rounded-sm ml-8 mt-4 uppercase text-white text-sm ${selectedAddress?._id === item?._id ? "block" : "hidden"}`}>
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
      )}
    </>
  );
}

export default ChooseAddress;
