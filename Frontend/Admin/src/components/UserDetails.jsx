import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { IoGiftOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../config";
import axios from "axios";

function UserDetails() {
  const [user, setUser] = useState({});
  const data = useLocation();
  // console.log("data : ", data);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/admin/users/${data.state.userId}`);
        console.log("result : ", result.data);
        setUser(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  // console.log("data : ", data.state);
  return (
    <>
      <div className="flex justify-between gap-4 mb-8 ">
        <div className="text-[#566a7f]">
          <p className=" text-xl font-semibold mb-2">
            Customer ID : <span>{user?.userDetails?._id}</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 border rounded-md bg-white p-4 px-6 pt-10 shadow-md">
          <div className="w-[110px] bg-purple-400 h-[110px] rounded-md mx-auto">
            <img src={(user?.userDetails?.image && `${BASE_URL}/uploads/${user.userDetails?.image}`) || ""} alt="" className="h-full" />
          </div>
          <p className="text-center text-xl my-2">{user?.userDetails?.username}</p>
          <small className="mx-auto block w-max">
            Customer ID : <span>32dslasdk9lsdk</span>
          </small>
          {/* <div className="flex justify-around mt-10 pb-6">
            <div className="flex items-center gap-4">
              <div>
                <AiOutlineShoppingCart className="text-[30px] text-[#696cff]" />
              </div>
              <div>
                <p>184</p>
                <p>orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <BiRupee className="text-[30px] text-[#696cff]" />
              </div>
              <div>
                <p>184</p>
                <p>orders</p>
              </div>
            </div>
          </div> */}
          <hr className="mt-4" />
          <div className="mt-6 flex flex-col gap-4 ">
            <p>Details</p>
            <h3>
              Username : <span>{user?.userDetails?.username}</span>
            </h3>
            <h3>
              Email : <span>{user?.userDetails?.email}</span>
            </h3>
            <h3>
              State : <span>Kerala</span>
            </h3>
            <h3>
              Contact : <span>389293292</span>
            </h3>
          </div>
          <button className="block mx-auto bg-[#696cff] text-white px-8 py-2 rounded-md mt-8">Edit Details</button>
        </div>
        <div className="col-span-8  grid grid-cols-12 gap-5 ">
          <div className="bg-white border rounded-md text-[#566a7f] shadow-md min-w-48 col-span-6 min-h-48 h-max flex flex-col p-6 gap-4">
            <div>
              <BiRupee className="text-[30px] text-[#696cff]" />
            </div>
            <p className="text-lg font-semibold">Account Balance</p>
            <p className="text-[#696cff] text-lg font-semibold">
              {user?.walletDetails?.balance || "0"} <small className="text-[#566a7f] ">balance Left</small>
            </p>
            <p>Account balance for next purchase</p>
          </div>
          <div className="bg-white border rounded-md text-[#566a7f] shadow-md min-w-48 col-span-6 min-h-48 h-max flex flex-col p-6 gap-4">
            <div>
              <IoGiftOutline className="text-[30px] text-[#696cff]" />
            </div>
            <p className="text-lg font-semibold">Wishlist</p>
            <p className="text-[#f5853f] font-bold text-xl">
              {user?.wishlistItemsCount || "0"} <span className="text-[#566a7f] font-semibold text-sm">Items in wishlist</span>
            </p>
            <p>Receive notification when items go on sale</p>
          </div>
          <div className="bg-white border rounded-md text-[#566a7f] shadow-md min-w-48 col-span-6 min-h-48 h-max flex flex-col p-6 gap-4">
            <div>
              <AiOutlineShoppingCart className="text-[30px] text-[#696cff]" />
            </div>
            <p className="text-lg font-semibold">Cart</p>
            <p className="text-[#f5853f] font-bold text-xl">
              {user?.cartItemsCount || "0"} <span className="text-[#566a7f] font-semibold text-sm">Items in cart</span>
            </p>
            <p>Receive notification when items go on sale</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
