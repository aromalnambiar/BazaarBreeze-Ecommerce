import { useEffect, useState } from "react";
import photo from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import Specification from "./Specification";

function Product() {
  const { id: productId } = useParams();
  const [item, setItem] = useState({});
  const [category, setCategory] = useState("");
  const [isSpecification, setIsSpecification] = useState(false);
  const [isCartFound, setIsCartFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${BASE_URL}/user/products/${productId}?userId=${userId}`);
      console.log("RESPONSE : ", response);
      setItem(response.data.productDetails);
      setCategory(response.data.category);
      setIsCartFound(response.data.isCartFound);
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [productId]); 

  const handleAddToCart = async (id) => {
    try {
      console.log("ID : ", id);
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`${BASE_URL}/user/cart`, {
        userId,
        productVariantId: id,
        quantity: 1,
      });
      // console.log(response);
      setIsCartFound(true);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // console.log("item : ", item);
  return (
    <>
      <div className="grid grid-cols-12 mt-8 text-sm max-w-[940px]  gap-8">
        <div className="col-span-10 col-start-2 col-end-12 lg:col-span-6">
          <div className="border max-w-[350px] min-h-[310px] p-10 mx-auto">
            <img className="mx-auto w-full h-full" src={`${BASE_URL}/uploads/${item?.productDetails?.images[0]}` || photo} alt="" />
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
                Category: <span className="font-semibold">{category}</span>
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
          <div className="flex items-center h-10 my-6 gap-4 text-xs font-bold justify-center">
            {isCartFound ? (
              <button onClick={() => navigate("/cart")} className="bg-[#FA8232] text-white  px-16 h-full rounded ">
                VIEW CART
              </button>
            ) : (
              <button onClick={() => handleAddToCart(item.productDetails._id)} className="bg-[#FA8232] text-white  px-16 h-full rounded ">
                ADD TO CART
              </button>
            )}
            <button className="outline outline-[#FA8232] text-[#FA8232] h-full  rounded  px-6">BUY NOW</button>
          </div>
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <p>Add to wishlist</p>
          </div>
        </div>
      </div>
      <div className=" mt-16 max-w-[940px] text-sm mx-auto mb-10">
        <div className="flex justify-center gap-20 border items-center h-16">
          <button onClick={() => setIsSpecification(false)} className={`${!isSpecification && "border-b-4 border-b-[#FA8232]"} h-full`}>
            DESCRIPTION
          </button>
          <button onClick={() => setIsSpecification(true)} className={`${isSpecification && "border-b-4 border-b-[#FA8232] "} h-full`}>
            SPECIFICATION
          </button>
        </div>
        {isSpecification ? (
          <>
            <Specification specifications={item.productDetails.specification} />
          </>
        ) : (
          <>
            <div className="p-12 border">
              <p>The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook, and all the ports you need. The first notebook of its kind, this MacBook Pro is a beast. M1 Pro takes the exceptional performance of the M1 architecture to a whole new level for pro users.</p>
              <p>Even the most ambitious projects are easily handled with up to 10 CPU cores, up to 16 GPU cores, a 16‑core Neural Engine, and dedicated encode and decode media engines that support H.264, HEVC, and ProRes codecs.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Product;
