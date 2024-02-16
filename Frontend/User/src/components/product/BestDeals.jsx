import { useEffect, useState } from "react";
import product from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

function BestDeals() {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/user/products`)
      .then((res) => {
        // console.log(res.data.products);
        setproducts(res.data.products);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  // console.log("Products : ", products);

  const handleClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div className="mx-auto text-xs md:text-base break-all">
      <div className="flex my-4  justify-between mx-20 md:mx-0">
        <h4 className="font-bold">Best Deals</h4>
        <p className="text-[#2DA5F3] font-medium cursor-pointer">Browse All product </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {products.map((item) => {
          return (
            <div key={item._id} onClick={() => handleClick(item)} className="flex w-48 h-64  relative cursor-pointer flex-col p-2 border">
              {/* {console.log(item.firstVariant?.images[0])} */}
              <img className="w-52" src={`${BASE_URL}/uploads/${item.firstVariant?.images[0]}` || product} alt="" />
              <div className="absolute bottom-2">
                <p className="text-sm w-44 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">{item.description}</p>
                <p>₹ {item.firstVariant?.salePrice}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BestDeals;
