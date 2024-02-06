import { useState } from "react";
import photo from "../../assets/images/Laptop.png";
import Steps from "../order/Steps";

function OrderDetails() {
  const [item, setItem] = useState({});
  return (
    <>
      <div className="grid grid-cols-12  text-sm max-w-[940px]  gap-8">
        <div className="col-span-10 col-start-2 col-end-12 lg:col-span-6">
          <div className="border max-w-[350px] min-h-[310px] p-10 mx-auto">
            <img className="mx-auto w-full h-full" src={photo} alt="" />
          </div>
        </div>
        <div className="col-span-10 col-start-2 col-end-12 lg:col-span-6">
          <h3 className="font-semibold mb-4">{item.description || "2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray"}</h3>
          <div>
            <div className="flex justify-between text-[#5F6C72]">
              <p>
                Sku: <span className="font-semibold">A264671</span>
              </p>
              <p>
                Availability: <span className="text-green-500">In Stock</span>
              </p>
            </div>
            <div className="flex justify-between text-[#5F6C72]">
              <p>
                Brand: <span className="font-semibold">{item.brand || "Brand"}</span>
              </p>
              <p>
                Category: <span className="font-semibold">category</span>
              </p>
            </div>
          </div>
          <p className="text-[#2DA5F3] font-bold my-6">{item.productDetails?.salePrice}₹</p>
          <hr className="mb-6" />
          <div className="flex justify-between ">
            <div className="flex flex-col gap-2">
              <p>Color</p>
              <div className="flex">
                <div>c</div>
                <div>c</div>
              </div>
              <p>Memory</p>
              <p>16GB unified memory</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>Size</p>
              <div>Screen size</div>
              <p>Storage</p>
              <div>1TB SSD Storage</div>
            </div>
          </div>
          <div className="flex items-center h-10 my-6 gap-4 text-xs font-bold justify-end">
            <button className="outline outline-gray-400 text-gray-700 h-full  rounded  px-6">Quantity : 1</button>
            <button className="outline outline-[#FA8232] text-[#FA8232] h-full  rounded  px-6">View in detail</button>
            <button className="bg-[#FA8232] text-white  px-8 h-full rounded ">CANCEL ORDER</button>
          </div>
        </div>
      </div>
      <div className="bg-[#FDFAE7] flex justify-between border border-[#F7E99E] h-20 p-4">
        <h3>#96459761</h3>
        <p className="text-[#2DA5F3] text-2xl text-right font-bold">$23432</p>
      </div>
      <Steps />
    </>
  );
}

export default OrderDetails;
