import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import Specification from "./Specification";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="border rounded-lg p-4 mb-4">
            {loading ? (
              <Skeleton height={300} width="100%" />
            ) : (
              <InnerImageZoom
                src={`${image}` || ""}
                alt="Product Image"
                zoomSrc={`${image}` || ""}
                zoomScale={1.8}
                zoomType="hover"
                width="100%"
                height={300}
                enlargeable={true}
              />
            )}
          </div>
          <div className="overflow-x-auto whitespace-nowrap pb-2">
            <div className="flex gap-4 justify-center">
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

        {/* Product Info Section */}
        <div className="w-full lg:w-1/2">
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
            <div className="p-1 sm:p-0">
              <h3 className=" font-semibold  mb-4">{description}</h3>
              <div className="mb-4">
                <p className="text-green-500">In Stock</p>
                <p>
                  Brand: <span className="font-semibold">{brand}</span>
                </p>
                <p>
                  Category: <span className="font-semibold">{category}</span>
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-6">
                Price: {calculateFinalPrice()}₹
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((item, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded ${
                      index === activeTab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleTabClick(index, item)}
                  >
                    Variant {index + 1}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <p>Size: Screen size</p>
                <p>Storage: 1TB SSD Storage</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 text-xs font-bold">
                <button
                  onClick={() =>
                    isCartFound
                      ? navigate("/cart")
                      : handleAddToCart(item?.productDetails?._id || item?._id)
                  }
                  className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded flex items-center justify-center gap-2"
                >
                  <IoCartOutline size={22} />
                  {isCartFound ? "VIEW CART" : "ADD TO CART"}
                </button>
                <button
                  onClick={() =>
                    isWishlistFound
                      ? handleRemoveFromWishlist(
                          item?.productDetails?._id || item?._id
                        )
                      : handleAddToWishlist(
                          item?.productDetails?._id || item?._id
                        )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 px-8 py-3 rounded font-bold"
                >
                  {isWishlistFound ? (
                    <FaHeart size={22} color="red" />
                  ) : (
                    <FaRegHeart size={22} />
                  )}
                  {isWishlistFound ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description and Specification Section */}
      <div className="mt-16 max-w-[940px] text-sm lg:text-base mx-auto mb-10">
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
            <div className="p-6 sm:p-12 border">
              {loading ? <Skeleton height={200} width="100%" /> : description}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Product;
