import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import Specification from "./Specification";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./styles.css";

function Product() {
  const { id: productId } = useParams();
  const [item, setItem] = useState({});
  const [description, setDescription] = useState("");
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/products/${productId}/product`
        );
        setTabs(response.data?.variantIds);
        setItem(response.data.productDetails);
        setBrand(response.data.productDetails.brand);
        setDescription(response.data.productDetails.description);
        setCategory(response.data.category);
        setIsCartFound(response.data.isCartFound);
        setIsWishlistFound(response.data.isWishlistFound);
        setSpecification(
          response.data.productDetails.productDetails.specification
        );
        setImage(response.data.productDetails.productDetails.publicIds[0]);
        setGalleryImages(response.data.productDetails.productDetails.publicIds);
        setDataRetrieved(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get(`/user/offers/${productId}`);
        setOffer(response?.data?.highestDiscountOffer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [productId]);

  const handleAddToCart = async (id) => {
    try {
      const response = await axiosInstance.post(`/user/cart`, {
        productVariantId: id,
        quantity: 1,
      });
      setIsCartFound(true);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleAddToWishlist = async (productVariant) => {
    try {
      const response = await axiosInstance.post(`/user/wishlist`, {
        productVariant,
      });
      setIsWishlistFound((prev) => !prev);
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (productVariant) => {
    try {
      const response = await axiosInstance.put(`/user/wishlist`, {
        productVariant,
      });
      setIsWishlistFound((prev) => !prev);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleGalleryImageClick = (base_url) => {
    setImage(base_url);
  };

  const handleTabClick = async (index, id) => {
    console.log("Index : ", index);
    console.log("id : ", id);
    setActiveTab(index);
    setLoading(true); // Show loading skeletons for tab change
    try {
      const response = await axiosInstance.get(`/user/products/variants/${id}`);
      // console.log("response : ", response);
      setItem(response.data.productVariant);
      setIsWishlistFound(response.data.isWishlistFound);
      setIsCartFound(response.data.isCartFound);
      setImage(response.data.productVariant.publicIds[0]);
      setGalleryImages(response.data.productVariant.publicIds);
      setSpecification(response.data.productVariant.specification);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Hide loading skeletons after tab data is loaded
    }
  };

  const calculateFinalPrice = () => {
    if (!offer) {
      return item.productDetails?.salePrice || item?.salePrice;
    }

    const salePrice = item.productDetails?.salePrice || item?.salePrice;

    if (offer.discountType === "FixedAmount") {
      return salePrice - offer.discountValue;
    } else if (offer.discountType === "Percentage") {
      const discount = (offer.discountValue / 100) * salePrice;
      return salePrice - discount;
    }

    return salePrice;
  };

  return (
    <>
      <div className="grid grid-cols-12 mt-8 text-sm max-w-[940px] gap-8">
        <div className="col-span-10 overflow-hidden col-start-2 col-end-12 lg:col-span-6 h-max border p-4 rounded-md ">
          <div className="border rounded-lg max-w-[350px] h-[310px] p-10 mx-auto">
            <div style={{ height: "210px", overflow: "hidden" }}>
              {loading ? (
                <Skeleton height={210} width={350} />
              ) : (
                <InnerImageZoom
                  src={`${image}` || ""}
                  alt="Product Image"
                  zoomSrc={`${image}` || ""}
                  zoomScale={1.8}
                  zoomType="hover"
                  width={350}
                  height={210}
                  enlargeable={true}
                />
              )}
            </div>
          </div>

          <div className="mt-6 w-max max-w-[24rem] mx-auto whitespace-nowrap overflow-x-scroll no-scrollbar ">
            <div className="flex gap-4 ">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} height={64} width={64} />
                  ))
                : galleryImages.length > 1 &&
                  galleryImages.map((image, index) => (
                    <img
                      key={index}
                      className="cursor-pointer shadow-sm object-contain w-16 h-16 border rounded-lg"
                      src={`${image}`}
                      alt={`Gallery Image ${index + 1}`}
                      onClick={() => handleGalleryImageClick(image)}
                    />
                  ))}
            </div>
          </div>
        </div>
        <div className="col-span-10 col-start-2 col-end-12 lg:col-span-6">
          {loading ? (
            <>
              <Skeleton height={30} width="80%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={30} width="40%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={20} width="60%" />
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-4">
                {description ||
                  "2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD Storage) - Space Gray"}
              </h3>
              <div>
                <div className="flex justify-between text-[#5F6C72]">
                  <p>
                    Availability:{" "}
                    <span className="text-green-500">In Stock</span>
                  </p>
                </div>
                <div className="flex justify-between text-[#5F6C72]">
                  <p>
                    Brand:{" "}
                    <span className="font-semibold">{brand || "Brand"}</span>
                  </p>
                  <p>
                    Category: <span className="font-semibold">{category}</span>
                  </p>
                </div>
              </div>
              <p className={`text-[#2DA5F3] text-lg font-bold my-6`}>
                Price : {item.productDetails?.salePrice || item?.salePrice}₹
              </p>
              <div className="flex">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} height={40} width={80} />
                    ))
                  : tabs.map((item, index) => (
                      <button
                        key={index}
                        className={`font-bold px-4 py-2 border-b-2 focus:outline-none ${
                          index === activeTab
                            ? "text-[#2DA5F3] border-[#2DA5F3]"
                            : "text-gray-500"
                        }`}
                        onClick={() => handleTabClick(index, item)}
                      >
                        variant {index + 1}
                      </button>
                    ))}
              </div>
              <hr className="mb-6" />
              <div className="flex justify-between ">
                {loading ? (
                  <>
                    <Skeleton height={30} width="60%" />
                    <Skeleton height={30} width="30%" />
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p>Size</p>
                    <div>Screen size</div>
                    <p>Storage</p>
                    <div>1TB SSD Storage</div>
                  </div>
                )}
              </div>
              <div className="flex items-center h-10 my-6 mt-[60px] gap-4 text-xs font-bold justify-start">
                {dataRetrieved && isCartFound ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-[#FA8232] text-white px-16 h-full rounded "
                  >
                    VIEW CART
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleAddToCart(item?.productDetails?._id || item?._id)
                    }
                    className="bg-[#FA8232] text-white px-16 h-full rounded "
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
              <div
                onClick={() => {
                  if (isWishlistFound) {
                    handleRemoveFromWishlist(
                      item?.productDetails?._id || item?._id
                    );
                  } else {
                    handleAddToWishlist(item?.productDetails?._id || item?._id);
                  }
                }}
                className="flex items-center justify-start w-max gap-2 mt-[40px] cursor-pointer"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z"
                    fill={isWishlistFound ? "red" : "white"}
                  />
                  <path
                    d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z"
                    fill={isWishlistFound ? "red" : "gray"}
                  />
                </svg>

                {loading ? (
                  <Skeleton height={20} width="100px" />
                ) : (
                  <p>Add to wishlist</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-16 max-w-[940px] text-sm mx-auto mb-10">
        <div className="flex justify-center gap-20 border items-center h-16">
          <button
            onClick={() => setIsSpecification(false)}
            className={`${
              !isSpecification && "border-b-4 border-b-[#FA8232]"
            } h-full`}
          >
            DESCRIPTION
          </button>
          <button
            onClick={() => setIsSpecification(true)}
            className={`${
              isSpecification && "border-b-4 border-b-[#FA8232]"
            } h-full`}
          >
            SPECIFICATION
          </button>
        </div>
        {isSpecification ? (
          <>
            {loading ? (
              <Skeleton height={200} width="100%" />
            ) : (
              <Specification specifications={specification} />
            )}
          </>
        ) : (
          <>
            <div className="p-12 border">
              {loading ? <Skeleton height={200} width="100%" /> : description}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Product;
