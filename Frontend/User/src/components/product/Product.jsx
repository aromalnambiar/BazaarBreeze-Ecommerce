import { useEffect, useState } from "react";
import photo from "../../assets/images/Laptop.png";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import Specification from "./Specification";
import Modal from "../common/Modal";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import "./styles.css";

function Product() {
  const { id: productId } = useParams();
  const [item, setItem] = useState({});
  const [description, setDescription] = useState();
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [isSpecification, setIsSpecification] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isCartFound, setIsCartFound] = useState(false);
  const [isWishlistFound, setIsWishlistFound] = useState(false);
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [specification, setSpecification] = useState([]);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(`${BASE_URL}/user/products/${productId}/product`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      // console.log("RESPONSE : ", response.data);
      setTabs(response.data?.variantIds);
      // console.log("RESPONSE : ", response.data.productDetails);
      // setTabs(response.data.productDetails);
      setItem(response.data.productDetails);
      setBrand(response.data.productDetails.brand);
      setDescription(response.data.productDetails.description);
      setCategory(response.data.category);
      setIsCartFound(response.data.isCartFound);
      setIsWishlistFound(response.data.isWishlistFound);
      setSpecification(response.data.productDetails.productDetails.specification);
      setImage(response.data.productDetails.productDetails.images[0]);
      setGalleryImages(response.data.productDetails.productDetails.images);
      setDataRetrieved(true);
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(`${BASE_URL}/user/offers/${productId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      console.log("response offer : ", response?.data?.highestDiscountOffer);
      setOffer(response?.data?.highestDiscountOffer);
    };
    fetchDetails();
  }, [productId]);

  // console.log("specification: ", specification);
  // console.log("Item  : ", item);
  const handleAddToCart = async (id) => {
    try {
      console.log("ID : ", id);
      const response = await axios.post(
        `${BASE_URL}/user/cart`,
        {
          productVariantId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response);
      setIsCartFound(true);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // console.log("item : ", item.productDetails);

  const handleAddToWishlist = async (productVariant) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/wishlist`,
        { productVariant },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log(response.data);
      setIsWishlistFound((prev) => !prev);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };
  const handleRemoveFromWishlist = async (productVariant) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user/wishlist`,
        { productVariant },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setIsWishlistFound((prev) => !prev);

      console.log(response.data);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };
  const handleGalleryImageClick = (base_url) => {
    setImage(base_url);
  };

  const handleTabClick = async (index, id) => {
    setActiveTab(index);
    try {
      const response = await axios.get(`${BASE_URL}/user/products/variants/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      // console.log("handleClick Tab : ", response.data);

      // console.log("RESPONSE : ", response.data);
      // setTabs(response.data.productDetails);
      setItem(response.data.productVariant);
      setIsWishlistFound(response.data.isWishlistFound);
      setIsCartFound(response.data.isCartFound);
      setImage(response.data.productVariant.images[0]);
      setGalleryImages(response.data.productVariant.images);
      setSpecification(response.data.productVariant.specification);
    } catch (error) {
      console.log(error);
    }
    // Add any additional logic you want to perform when a tab is clicked
  };

  // Calculate final product price based on the offer
  const calculateFinalPrice = () => {
    if (!offer) {
      return item.productDetails?.salePrice || item?.salePrice;
    }

    const salePrice = item.productDetails?.salePrice || item?.salePrice;

    // Check if the offer is a fixed price or percentage
    if (offer.discountType === "FixedAmount") {
      // Deduct the fixed price from the salePrice
      return salePrice - offer.discountValue;
    } else if (offer.discountType === "Percentage") {
      // Deduct the percentage from the salePrice
      const discount = (offer.discountValue / 100) * salePrice;
      return salePrice - discount;
    }

    // Default to the original salePrice if the offer type is not recognized
    return salePrice;
  };

  // console.log("item : ", item);
  // console.log("wishlistFound : ", isWishlistFound);
  // console.log("galleryimages : ", galleryImages);
  return (
    <>
      <div className="grid grid-cols-12 mt-8 text-sm max-w-[940px]  gap-8">
        <div className="col-span-10 overflow-hidden col-start-2 col-end-12 lg:col-span-6 h-max border p-4 rounded-md ">
          <div className="border rounded-lg max-w-[350px] h-[310px] p-10 mx-auto">
            <div style={{ height: "210px", overflow: "hidden" }}>
              <InnerImageZoom src={`${BASE_URL}/uploads/${image}` || photo} alt="Product Image" zoomSrc={`${BASE_URL}/uploads/${image}` || photo} zoomScale={1.5} zoomType="hover" width={350} height={210} enlargeable={true} />
            </div>
          </div>

          <div className="mt-6 w-max   max-w-[24rem] mx-auto whitespace-nowrap overflow-x-scroll no-scrollbar ">
            <div className="flex gap-4 ">{galleryImages.length > 1 && galleryImages.map((image, index) => <img key={index} className="cursor-pointer shadow-sm object-contain w-16 h-16 border rounded-lg" src={`${BASE_URL}/uploads/${image}`} alt={`Gallery Image ${index + 1}`} onClick={() => handleGalleryImageClick(image)} />)}</div>
          </div>
        </div>
        <div className="col-span-10 col-start-2 col-end-12 lg:col-span-6">
          <h3 className="font-semibold mb-4">{description || "2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray"}</h3>
          <div>
            <div className="flex justify-between text-[#5F6C72]">
              {/* <p>
                Sku: <span className="font-semibold">A264671</span>
              </p> */}
              <p>
                Availability: <span className="text-green-500">In Stock</span>
              </p>
            </div>
            <div className="flex justify-between text-[#5F6C72]">
              <p>
                Brand: <span className="font-semibold">{brand || "Brand"}</span>
              </p>
              <p>
                Category: <span className="font-semibold">{category}</span>
              </p>
            </div>
          </div>
          {/* ${offer && "line-through"} */}
          {/* {console.log("item ::: ", item)} */}
          <p className={`text-[#2DA5F3] text-lg font-bold  my-6`}>Price : {item.productDetails?.salePrice || item?.salePrice}₹</p>
          {/* {offer && (
            <>
              
              <div className="flex items-center gap-8 ">
                <p className=" font-bold text-[#26ae4a] text-lg my-6">
                  OfferPrice : <span className="text-green-500">{calculateFinalPrice()}₹</span>
                </p>

              </div>
              <p className=" font-bold my-6 text-green-500">🎉 {offer.description}</p>
            </>
          )} */}
          {/* //tabs */}
          <div className="flex">
            {tabs.map((item, index) => (
              <button key={index} className={`font-bold px-4 py-2 border-b-2 focus:outline-none ${index === activeTab ? "text-[#2DA5F3] border-[#2DA5F3]" : "text-gray-500"}`} onClick={() => handleTabClick(index, item)}>
                variant {index + 1}
              </button>
            ))}
          </div>
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
          {/* {console.log("ITEM : ", item)} */}
          <div className="flex items-center  h-10 my-6 mt-[60px] gap-4 text-xs font-bold justify-start">
            {dataRetrieved && isCartFound ? (
              <button onClick={() => navigate("/cart")} className="bg-[#FA8232] text-white  px-16 h-full rounded ">
                VIEW CART
              </button>
            ) : (
              <button onClick={() => handleAddToCart(item?.productDetails?._id || item?._id)} className="bg-[#FA8232] text-white  px-16 h-full rounded ">
                ADD TO CART
              </button>
            )}
          </div>
          <div
            onClick={() => {
              if (isWishlistFound) {
                handleRemoveFromWishlist(item?.productDetails?._id || item?._id);
              } else {
                handleAddToWishlist(item?.productDetails?._id || item?._id);
              }
            }}
            className="flex items-center justify-start w-max  gap-2 mt-[40px] cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z" fill={isWishlistFound ? "red" : "white"} />
              <path d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z" fill={isWishlistFound ? "red" : "gray"} />
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
            <Specification specifications={specification} />
          </>
        ) : (
          <>
            <div className="p-12 border">{description}</div>
          </>
        )}
      </div>
    </>
  );
}

export default Product;
