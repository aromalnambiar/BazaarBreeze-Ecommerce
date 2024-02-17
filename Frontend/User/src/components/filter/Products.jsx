import { useEffect, useState } from "react";
import product from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

function Products() {
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
    window.scrollTo(0, 0);
  }, []);

  console.log("Products : ", products);

  const handleClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div className="mx-auto text-xs mt-8 md:text-base break-all">
      <div className="flex flex-wrap justify-center gap-2">
        {products.map((item) => {
          return (
            <div key={item._id} onClick={() => handleClick(item)} className="flex w-44 h-64 my-2 relative cursor-pointer flex-col p-2 border">
              {/* {console.log(item.firstVariant?.images[0])} */}
              <div className="w-44 h-44  overflow-hidden">
                <img className="w-40 rounded-sm" src={`${BASE_URL}/uploads/${item.firstVariant?.images[0]}` || product} alt="" />
              </div>
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

export default Products;
