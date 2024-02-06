import { MdOutlineDashboard } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { CgTrack } from "react-icons/cg";
import { LuShoppingCart } from "react-icons/lu";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaIdCardSolid } from "react-icons/lia";
import { GoGear } from "react-icons/go";
import { LuWallet } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";

function SideNav() {
  const navigate = useNavigate("");
  const dispatch = useDispatch();

  const logoComponents = {
    MdOutlineDashboard,
    LuHistory,
    CgTrack,
    LuShoppingCart,
    IoMdHeartEmpty,
    LiaIdCardSolid,
    GoGear,
    LuWallet,
    TbLogout,
  };
  let lists = [
    { name: "Dashboard", logo: "MdOutlineDashboard", path: "/dashboard" },
    { name: "Order History", logo: "LuHistory", path: "/dashboard/orders" },
    { name: "Track Order", logo: "CgTrack", path: "/dashboard" },
    { name: "Shopping Cart", logo: "LuShoppingCart", path: "/dashboard/carts" },
    { name: "Wishlist", logo: "IoMdHeartEmpty", path: "/dashboard/wishlists" },
    { name: "Cards&Address", logo: "LiaIdCardSolid", path: "/dashboard/cards" },
    { name: "Settings", logo: "GoGear", path: "/dashboard/settings" },
    { name: "Wallet", logo: "LuWallet", path: "/wallet" },
    { name: "Logout", logo: "TbLogout", path: "/logout" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  const handleClick = (path) => {
    if (path == "/logout" && confirm("Are you sure ?")) {
      handleLogout();
      navigate("/");
    } else {
      navigate(item.path);
    }
  };

  return (
    <ul className="py-4">
      {lists.map((item) => {
        const LogoComponent = logoComponents[item.logo];
        return (
          <li onClick={() => handleClick(item.path)} className="flex items-center gap-4 pl-6 cursor-pointer text-gray-600 hover:bg-[#FA8232] hover:text-white p-2" key={item.name}>
            <LogoComponent />
            <p>{item.name}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default SideNav;
