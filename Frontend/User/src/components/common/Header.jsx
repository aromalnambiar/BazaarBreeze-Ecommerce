import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/icons/Logo.png";
import LogoSm from "../../assets/icons/Logo-sm.png";
import { useState, useEffect, useRef, useCallback } from "react";
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

  const productsRef = useRef(null);
  const lastCallRef = useRef(0);

  const throttle = useCallback((func, delay) => {
    return function () {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        func();
      }
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/products/search?query=${query}`
      );
      setProducts([...response.data]);
      setShowProducts(true);
    } catch (error) {
      console.error(error);
    }
  };

  const throttledSearch = useCallback(throttle(handleSearch, 500), [
    throttle,
    handleSearch,
  ]);

  useEffect(() => {
    if (query === "" || query.trim() === "") {
      setProducts([]);
      setShowProducts(false);
    } else {
      throttledSearch();
    }
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
                  <RiSearchLine className="text-gray-400" size={16} />
                </div>
              </div>
              {showProducts && products.length > 0 && (
                <div className="bg-white border py-2 mt-1 rounded-md shadow-lg w-full absolute left-0 right-0 z-10">
                  {products.map((item) => (
                    <Link
                      key={item._id}
                      to={`product/${item._id}`}
                      onClick={() => setShowProducts(false)}
                      className="block px-4 py-2 hover:bg-slate-100 text-sm"
                    >
                      {item.name}
                    </Link>
                  ))}
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
