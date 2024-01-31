import { useEffect, useState } from "react";
import product from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProduct } from "../../redux/reducers/userSlice";

function BestDeals() {
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/user/products`)
      .then((res) => {
        console.log(res.data.products);
        setproducts(res.data.products);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const handleClick = (item) => {
    dispatch(setProduct(item));
    navigate("/product");
  };

  return (
    <div className="mx-auto md:max-w-[1020px] break-all">
      <div className="flex my-4  justify-between mx-20 md:mx-0">
        <h4 className="font-bold">Best Deals</h4>
        <p className="text-[#2DA5F3] font-medium">Browse All product </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {products.map((item) => {
          return (
            <div key={item._id} onClick={() => handleClick(item)} className="flex w-48 cursor-pointer flex-col p-2 border">
              {console.log(item.firstVariant.images[0])}
              <img className="w-52" src={`${BASE_URL}/uploads/${item.firstVariant.images[0]}` || product} alt="" />
              <p className="text-sm">{item.description}</p>
              <p>{item.firstVariant.salePrice || "2342"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BestDeals;
