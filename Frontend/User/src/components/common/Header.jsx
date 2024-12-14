import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/icons/Logo.png";
import LogoSm from "../../assets/icons/Logo-sm.png";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axiosConfig";
import {
  RiSearchLine,
  RiShoppingCart2Line,
  RiHeartLine,
  RiUser3Line,
} from "react-icons/ri";

function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const productsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        setProducts([]);
        setShowProducts(false);
        return;
      }

      setIsLoading(true);
      const response = await axiosInstance.get(
        `/user/products/search?query=${query}`
      );
      setProducts([...response.data]);
      setShowProducts(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setShowProducts(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="bg-[#1B6392] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 sm:py-4">
            <Link to={"/"} className="flex-shrink-0">
              <img src={LogoSm} alt="Logo" className="h-8 w-auto sm:hidden" />
              <img
                src={Logo}
                alt="Logo"
                className="hidden sm:block h-10 w-auto md:h-12"
              />
            </Link>

            <div
              className="flex-grow mx-2 sm:mx-4 md:mx-8 max-w-md"
              ref={productsRef}
            >
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 pr-8 py-1 sm:py-2 text-sm rounded-md"
                  type="text"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isLoading ? (
                    <div className="animate-spin">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <RiSearchLine className="text-gray-400" size={16} />
                  )}
                </div>
              </div>
              {showProducts && query.trim() && (
                <div className="bg-white border py-2 mt-1 rounded-md shadow-lg w-full absolute left-0 right-0 z-10 max-h-[60vh] overflow-y-auto custom-scrollbar lg:w-[90%] mx-auto">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <Link
                        key={item._id}
                        to={`product/${item._id}`}
                        onClick={() => setShowProducts(false)}
                        className="flex items-center px-4 py-2 hover:bg-slate-100 gap-3"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <RiSearchLine className="text-gray-400" size={20} />
                          </div>
                        )}
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="mb-3">
                        <RiSearchLine className="w-8 h-8 text-gray-400 mx-auto" />
                      </div>
                      <p className="text-gray-500 text-sm">No products found</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try searching with different keywords
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <ul className="flex items-center space-x-3 sm:space-x-6">
              {[
                { Icon: RiShoppingCart2Line, onClick: () => navigate("/cart") },
                { Icon: RiHeartLine, onClick: () => navigate("/wishlist") },
                {
                  Icon: RiUser3Line,
                  onClick: () => navigate("/user/signin", { replace: true }),
                },
              ].map(({ Icon, onClick }, index) => (
                <li key={index} onClick={onClick} className="cursor-pointer">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
