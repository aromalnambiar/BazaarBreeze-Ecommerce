import { MdOutlineDashboard } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { CgTrack } from "react-icons/cg";
import { LuShoppingCart } from "react-icons/lu";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaIdCardSolid } from "react-icons/lia";
import { BiSolidOffer } from "react-icons/bi";
import { GoGear } from "react-icons/go";
import { LuWallet } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import InvoiceGenerator from "./InvoiceBtn";
import axios from "axios";
import { BASE_URL } from "../../../config";

function SideNav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const logoComponents = {
    MdOutlineDashboard,
    LuHistory,
    CgTrack,
    LuShoppingCart,
    IoMdHeartEmpty,
    LiaIdCardSolid,
    GoGear,
    LuWallet,
    BiSolidOffer,
    TbLogout,
  };
  let lists = [
    { name: "Dashboard", logo: "MdOutlineDashboard", path: "/dashboard" },
    { name: "Order History", logo: "LuHistory", path: "/dashboard/orders" },
    { name: "Track Order", logo: "CgTrack", path: "/dashboard/track" },
    { name: "Shopping Cart", logo: "LuShoppingCart", path: "/dashboard/carts" },
    { name: "Wishlist", logo: "IoMdHeartEmpty", path: "/dashboard/wishlists" },
    { name: "Cards&Address", logo: "LiaIdCardSolid", path: "/dashboard/cards" },
    { name: "Settings", logo: "GoGear", path: "/dashboard/settings" },
    { name: "Wallet", logo: "LuWallet", path: "/dashboard/wallet" },
    { name: "Offers", logo: "BiSolidOffer", path: "/dashboard/offers" },
    { name: "Logout", logo: "TbLogout", path: "/dashboard/logout" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  const handleClick = (path) => {
    if (path === "/dashboard/logout" && window.confirm("Are you sure?")) {
      handleLogout();
      navigate("/");
    } else {
      navigate(path);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/generateinvoice`, { responseType: "blob" });

      // Create a Blob from the PDF data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a link element and trigger a download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Handle error
    }
  };

  // Call the function when you want to download the invoice
  const handleClickMe = () => {
    downloadInvoice();
  };

  return (
    <ul className="py-4 shadow-md">
      {lists.map((item) => {
        const LogoComponent = logoComponents[item.logo];
        const isActive = location.pathname === item.path;

        return (
          <li onClick={() => handleClick(item.path)} className={`flex items-center gap-4 pl-6 cursor-pointer text-gray-600 ${isActive ? "bg-[#FA8232] text-white" : "hover:bg-[#ffa365] hover:text-white"} p-2`} key={item.name}>
            <LogoComponent />
            <p>{item.name}</p>
          </li>
        );
      })}
      <li onClick={handleClickMe}>download invoice</li>
    </ul>
  );
}

export default SideNav;
