import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/icons/Logo.png";
import { BASE_URL } from "../../../../Admin/config";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const productsRef = useRef(null);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/products/search?query=${query}`);
        setProducts([...response.data]);
        setShowProducts(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (query === "" || query.trim() === "") {
      setProducts([]);
      setShowProducts(false);
    } else {
      handleSearch();
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
  // console.log("products : ", products);
  // const handleBlur = () => {
  //   console.log("blur");
  //   setIsActive((prev) => !prev);
  // };
  return (
    <>
      <div className="bg-[#1B6392] sticky top-0 z-50">
        <div></div>
        <div className="flex max-w-[1020px] h-[88px] justify-center items-center mx-auto ">
          <Link to={"/"}>
            <div className="max-w-[190px] pt-[10px]">
              <img src={Logo} alt="" srcSet="" />
            </div>
          </Link>
          <div className="flex grow items-center md:mx-24 mx-4 h-10 relative rounded-md " ref={productsRef}>
            <div className="w-full  h-10 rounded-md overflow-hidden relative">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Search for anything..."
                className="w-full px-4 pr-10 h-10"
                type="text"
                // onBlur={handleBlur}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5625 15.625C13.1869 15.625 16.125 12.6869 16.125 9.0625C16.125 5.43813 13.1869 2.5 9.5625 2.5C5.93813 2.5 3 5.43813 3 9.0625C3 12.6869 5.93813 15.625 9.5625 15.625Z" stroke="#191C1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.2031 13.7031L18 17.5" stroke="#191C1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {showProducts && products.length > 0 && (
              <div className="bg-white border py-4 min-h-max rounded-md shadow-lg w-full top-12 absolute ">
                {products.map((item, idx) => {
                  return (
                    <Link key={item._id} to={`product/${item._id}`} onClick={() => setShowProducts(false)}>
                      <div className="border hover:bg-slate-100 p-2 pl-4">{item.name}</div>
                    </Link>
                  );
                })}
              </div>
            )} 
          </div>

          <ul className="flex gap-4 text-sm">
            <li onClick={() => navigate("/cart")} className="cursor-pointer">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 29C11.1046 29 12 28.1046 12 27C12 25.8954 11.1046 25 10 25C8.89543 25 8 25.8954 8 27C8 28.1046 8.89543 29 10 29Z" fill="white" />
                <path d="M23 29C24.1046 29 25 28.1046 25 27C25 25.8954 24.1046 25 23 25C21.8954 25 21 25.8954 21 27C21 28.1046 21.8954 29 23 29Z" fill="white" />
                <path d="M5.2875 9H27.7125L24.4125 20.55C24.2948 20.9692 24.0426 21.3381 23.6948 21.6001C23.3471 21.862 22.9229 22.0025 22.4875 22H10.5125C10.0771 22.0025 9.65293 21.862 9.30515 21.6001C8.95738 21.3381 8.70524 20.9692 8.5875 20.55L4.0625 4.725C4.0027 4.51594 3.8764 4.33207 3.70271 4.20125C3.52903 4.07042 3.31744 3.99977 3.1 4H1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
            <li onClick={() => navigate("/wishlist")} className="cursor-pointer">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 27C16 27 3.5 20 3.5 11.5C3.5 9.99736 4.02062 8.54113 4.97328 7.37907C5.92593 6.21702 7.25178 5.42092 8.72525 5.12623C10.1987 4.83154 11.7288 5.05645 13.0551 5.76271C14.3814 6.46897 15.4221 7.61295 16 9C16.5779 7.61295 17.6186 6.46897 18.9449 5.76271C20.2712 5.05645 21.8013 4.83154 23.2748 5.12623C24.7482 5.42092 26.0741 6.21702 27.0267 7.37907C27.9794 8.54113 28.5 9.99736 28.5 11.5C28.5 20 16 27 16 27Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
            <li onClick={() => navigate("/user/signin", { replace: true })} className="cursor-pointer">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" />
                <path d="M3.875 27C5.10367 24.8714 6.87104 23.1038 8.99944 21.8749C11.1278 20.6459 13.5423 19.9989 16 19.9989C18.4577 19.9989 20.8722 20.6459 23.0006 21.8749C25.129 23.1038 26.8963 24.8714 28.125 27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
