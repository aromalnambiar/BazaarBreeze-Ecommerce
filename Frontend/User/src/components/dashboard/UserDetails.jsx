import React, { useEffect, useState } from "react";
import { PiRocketLight } from "react-icons/pi";
import { FaRegNewspaper, FaRegCheckSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import profile from "../../assets/icons/user.png";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";

function AccountInfo({ user, handleEditAccount }) {
  // console.log("user : ", user);
  return (
    <div className="border min-h-[40vh] relative pb-20 overflow-hidden rounded-md col-span-4">
      <div className="text-sm font-semibold border-b">
        <p className="px-4 py-4">ACCOUNT INFO</p>
      </div>
      <div className="text-sm mx-4">
        <div className="flex text-xs items-center gap-4 my-4">
          <img src={`${BASE_URL}/uploads/${user.image}` || profile} className="w-10 h-10 rounded-full" alt="" srcSet="" />
          <div>
            <h3 className="text-sm ">{user.username}</h3>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-gray-600">
            <span className="text-black">Email : </span>
            {user.email}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Gender : </span>
            {user.gender || "Not set"}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Phone2 : </span>
            {user.age || "Not set"}
          </p>
          <button onClick={handleEditAccount} className="uppercase border absolute bottom-0 border-[#D5EDFD] text-[#2DA5F3] font-bold py-3 px-4 rounded-md mb-4 w-max mx-auto">
            Edit Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ShippingAddress({ item, handleEditAddress }) {
  return (
    <div key={item._id} className="border min-h-[40vh] relative pb-20  rounded-md col-span-4">
      <div className="text-sm font-semibold border-b">
        <p className="px-4 py-4">SHIPPING ADDRESS</p>
      </div>
      <div className="text-sm mx-4 ">
        <div className="flex flex-col  gap-4 mt-6">
          <p className="text-gray-600">
            <span className="text-black">FullName : </span>
            {item.fullName}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Address : </span>
            {item.address}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Pincode : </span>
            {item.pincode}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Phone1 : </span>
            {item.phone1}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Phone2 : </span> {item.phone2 || "Not set"}
          </p>
          <p className="text-gray-600">
            <span className="text-black">Street : </span> {item.street || "Not set"}
          </p>
          <p className="text-gray-600">
            <span className="text-black">State : </span> {item.state || "Not set"}
          </p>
          <button onClick={() => handleEditAddress(item)} className="absolute bottom-0 uppercase border border-[#D5EDFD] text-[#2DA5F3] font-bold py-3 px-4 rounded-md mb-4 w-max mx-auto">
            Edit Address
          </button>
        </div>
      </div>
    </div>
  );
}

function UserDetails() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [address, setAddress] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editAddressDetails, setEditAddressDetails] = useState({});

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log("Err : ", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/address`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAddress(res.data.addresses);
      })
      .catch((err) => {
        console.log("Err : ", err);
      });
  }, []);

  const handleAddAddress = () => {
    setIsToggle(!isToggle);
  };

  const handleEditAddress = (item) => {
    setIsEdit(!isEdit);
    setEditAddressDetails(item);
  };

  const handleEditAccount = () => {
    navigate("/dashboard/profile", { replace: true });
  };

  return (
    <>
      {isToggle ? (
        <AddAddress setIsToggle={setIsToggle} />
      ) : isEdit ? (
        <EditAddress setIsEdit={setIsEdit} addressDetails={editAddressDetails} />
      ) : (
        <div className="mb-10">
          <h3 className="text-lg font-bold my-2">Hello, User</h3>
          <p className="text-sm w-3/6">From your account dashboard. you can easily check & view your Recent Orders, manage your Shipping and Billing Addresses and edit your Password and Account Details.</p>
          <div className="grid relative grid-cols-12 gap-4 mt-4">
            <AccountInfo user={user} handleEditAccount={handleEditAccount} />

            <button onClick={handleAddAddress} className="uppercase border absolute  right-0  -top-[120px]  border-[#f3792d] text-[#f3792d] font-bold py-3 px-4 rounded-md mb-4 text-xs w-max ">
              Add Address
            </button>

            {address.map((item, index) => (
              <ShippingAddress key={item._id} item={item} handleEditAddress={handleEditAddress} />
            ))}

            <div className="min-h-[40vh] rounded-md col-span-4 flex flex-col gap-2">
              <div className="min-h-20  bg-[#EAF6FE] p-4 rounded-sm">
                <div className="flex items-center">
                  <div className="bg-white w-max text-3xl p-2 mr-4">
                    <PiRocketLight />
                  </div>
                  <div>
                    <h3>154</h3>
                    <p className="text-gray-400">Total orders</p>
                  </div>
                </div>
              </div>
              <div className="min-h-20  bg-[#FFF3EB] p-4 rounded-sm">
                <div className="flex items-center">
                  <div className="bg-white w-max text-3xl p-2 mr-4">
                    <FaRegNewspaper />
                  </div>
                  <div>
                    <h3>154</h3>
                    <p className="text-gray-400">Total orders</p>
                  </div>
                </div>
              </div>
              <div className="min-h-20  bg-[#EAF7E9] p-4 rounded-sm">
                <div className="flex items-center">
                  <div className="bg-white w-max text-3xl p-2 mr-4">
                    <FaRegCheckSquare />
                  </div>
                  <div>
                    <h3>154</h3>
                    <p className="text-gray-400">Total orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDetails;
