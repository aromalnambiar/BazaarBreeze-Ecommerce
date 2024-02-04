import profile from "../../assets/images/customer.png";
import { PiRocketLight } from "react-icons/pi";
import { FaRegNewspaper } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";

function UserDetails() {
  return (
    <div>
      <h3 className="text-lg font-bold my-2">Hello, Kevin</h3>
      <p className="text-sm w-3/6">From your account dashboard. you can easily check & view your Recent Orders, manage your Shipping and Billing Addresses and edit your Password and Account Details.</p>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="border min-h-[40vh] relative pb-20  rounded-md col-span-4">
          <div className="text-sm font-semibold border-b">
            <p className="px-4 py-4">ACCOUNT INFO</p>
          </div>
          <div className="text-sm mx-4">
            <div className="flex text-xs items-center gap-4 my-4">
              <img src={profile} className="w-10 h-10 rounded-full" alt="" srcSet="" />
              <div>
                <h3 className="text-sm ">Kevin Gilbert</h3>
                <p className="text-gray-600">Dhaka - 1207, Bangladesh</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <p className="text-gray-600">
                <span className="text-black">Email : </span>kevin.gilbert@gmail.com
              </p>
              <p className="text-gray-600">
                <span className="text-black">Phone1 : </span>+1-202-555-0118
              </p>
              <p className="text-gray-600">
                <span className="text-black">Phone2 : </span> +1-202-555-0118
              </p>
              <button className="uppercase border absolute bottom-0 border-[#D5EDFD] text-[#2DA5F3] font-bold py-3 px-4 rounded-md mb-4 w-max mx-auto">Edit Account</button>
            </div>
          </div>
        </div>
        <div className="border min-h-[40vh] relative pb-20  rounded-md col-span-4">
          <div className="text-sm font-semibold border-b">
            <p className="px-4 py-4">SHIPPING ADDRESS</p>
          </div>
          <div className="text-sm mx-4 ">
            <div className="flex text-xs items-center gap-4 my-4">
              <div>
                <h3 className="text-sm mb-2">Kevin Gilbert</h3>
                <p className="text-gray-600">East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh</p>
              </div>
            </div>
            <div className="flex flex-col  gap-4 mt-6">
              <p className="text-gray-600">
                <span className="text-black">Email : </span>kevin.gilbert@gmail.com
              </p>
              <p className="text-gray-600">
                <span className="text-black">Phone1 : </span>+1-202-555-0118
              </p>
              <p className="text-gray-600">
                <span className="text-black">Phone2 : </span> +1-202-555-0118
              </p>
              <button className="absolute bottom-0 uppercase border border-[#D5EDFD] text-[#2DA5F3] font-bold py-3 px-4 rounded-md mb-4 w-max mx-auto">Edit Address</button>
            </div>
          </div>
        </div>
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
  );
}

export default UserDetails;
