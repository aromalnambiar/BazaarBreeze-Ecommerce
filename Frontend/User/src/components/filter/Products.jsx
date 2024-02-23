import { useEffect, useState } from "react";
import product from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate, useLocation } from "react-router-dom";

function Products({ query }) {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();
  let location = useLocation();
  // console.log("query : ", query);
  // console.log("location : ", location.state.key);

  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/user/products/filter?${query}`)
      .then((res) => {
        // console.log(res.data);
        setproducts(res.data);
      })
      .catch((res) => {
        console.log(res);
      });
    // window.scrollTo(0, 0);
  }, [query]);

  // console.log("Products : ", products);

  const handleClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div className="mx-auto text-xs mt-8 md:text-base break-all">
      <div className="flex flex-wrap justify-center gap-2">
        {products.map((item) => {
          return (
            <div key={item?._id} onClick={() => handleClick(item)} className="flex w-44 h-64 my-2 relative cursor-pointer flex-col p-2 border">
              <div className="w-44 h-44  overflow-hidden">
                <img className="w-40 rounded-sm" src={`${BASE_URL}/uploads/${item?.variants[0]?.images[0]}` || product} alt="" />
              </div>
              <div className="absolute bottom-2">
                <p className="text-sm w-44 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-full">{item?.description}</p>
                <p>₹ {item?.variants[0]?.salePrice}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
