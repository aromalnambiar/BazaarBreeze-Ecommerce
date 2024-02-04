import { MdOutlineDashboard } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { CgTrack } from "react-icons/cg";
import { LuShoppingCart } from "react-icons/lu";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaIdCardSolid } from "react-icons/lia";
import { GoGear } from "react-icons/go";
import { LuWallet } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";

function SideNav() {
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
    { name: "Dashboard", logo: "MdOutlineDashboard" },
    { name: "Order History", logo: "LuHistory" },
    { name: "Track Order", logo: "CgTrack" },
    { name: "Shopping Cart", logo: "LuShoppingCart" },
    { name: "Wishlist", logo: "IoMdHeartEmpty" },
    { name: "Cards&Address", logo: "LiaIdCardSolid" },
    { name: "Settings", logo: "GoGear" },
    { name: "Wallet", logo: "LuWallet" },
    { name: "Logout", logo: "TbLogout" },
  ];
  return (
    <ul className="py-4">
      {lists.map((item) => {
        const LogoComponent = logoComponents[item.logo];
        return (
          <li className="flex items-center gap-4 pl-6 cursor-pointer text-gray-600 hover:bg-[#FA8232] hover:text-white p-2" key={item.name}>
            <LogoComponent />
            <p>{item.name}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default SideNav;
