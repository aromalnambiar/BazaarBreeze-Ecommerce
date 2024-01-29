import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { IoGiftOutline } from "react-icons/io5";

function UserDetails() {
  return (
    <>
      <div className="flex justify-between gap-4 mb-8 ">
        <div className="text-[#566a7f]">
          <p className=" text-xl font-semibold mb-2">
            Customer ID : <span>32asd32lsd</span>
          </p>
          <p>Aug 17,2020</p>
        </div>
        <span>
          <button className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md mr-4 ">Block Customer</button>
          <button className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">Delete Customer</button>
        </span>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 border rounded-md bg-white p-4 px-6 pt-10 shadow-md">
          <div className="w-[110px] bg-purple-400 h-[110px] rounded-md mx-auto">
            <img src="" alt="" className="h-full" />
          </div>
          <p className="text-center text-xl my-2">Sugunan</p>
          <small className="mx-auto block w-max">
            Customer ID : <span>32dslasdk9lsdk</span>
          </small>
          <div className="flex justify-around mt-10 pb-6">
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
          </div>
          <hr />
          <div className="mt-6 flex flex-col gap-4">
            <p>Details</p>
            <h3>
              Username : <span>loring.dsfdka</span>
            </h3>
            <h3>
              Email : <span>afdagds@gmail.com</span>
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
              $2343 <small className="text-[#566a7f] ">Credit Left</small>
            </p>
            <p>Account balance for next purchase</p>
          </div>
          <div className="bg-white border rounded-md text-[#566a7f] shadow-md min-w-48 col-span-6 min-h-48 h-max flex flex-col p-6 gap-4">
            <div>
              {" "}
              <IoGiftOutline className="text-[30px] text-[#696cff]" />
            </div>
            <p className="text-lg font-semibold">Wishlist</p>
            <p className="text-[#f5853f] font-bold text-xl">
              15 <span className="text-[#566a7f] font-semibold text-sm">Items in wishlist</span>
            </p>
            <p>Receive notification when items go on sale</p>
          </div>
          <div className="bg-white border rounded-md text-[#566a7f] shadow-md min-w-48 col-span-6 min-h-48 h-max flex flex-col p-6 gap-4">
            <div>
              <AiOutlineShoppingCart className="text-[30px] text-[#696cff]" />
            </div>
            <p className="text-lg font-semibold">Cart</p>
            <p className="text-[#f5853f] font-bold text-xl">
              15 <span className="text-[#566a7f] font-semibold text-sm">Items in cart</span>
            </p>
            <p>Receive notification when items go on sale</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
