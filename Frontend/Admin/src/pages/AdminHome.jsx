import Sidebar from "../components/Sidebar.jsx";
import Headerbar from "../../../User/src/components/common/Headerbar.jsx";
import UsersList from "../components/UsersList.jsx";
import UserDetails from "../../../User/src/components/common/UserDetails.jsx";
import CategoryList from "../components/CategoryList.jsx";
import AddCategory from "../components/AddCategory.jsx";
import AddProduct from "../components/AddProduct.jsx";
import AddImages from "../components/AddImages.jsx";
import { useParams } from "react-router-dom";
import ViewProducts from "../components/ViewProducts.jsx";
import AdminSignIn from "../components/AdminSignIn.jsx";

function AdminHome() {
  const d = useParams();
  const section = d["*"];
  console.log(section);
  // console.log(d['*']);

  const renderComponentBasedOnRoute = () => {
    switch (section) {
      case "users":
        return <UsersList />;
      case "user-details":
        return <UserDetails />;
      case "categories":
        return <CategoryList />;
      case "add-category":
        return <AddCategory />;
      case "add-product":
        return <AddProduct />;
      case "view-products":
        return <ViewProducts />;
      default:
        return <UsersList />;
    }
  };
  return (
    <>
      <div className="grid gap-8 grid-cols-12 pr-10 min-h-screen h-full bg-[#f5f5f9]">
        <Sidebar />
        <div className="col-span-12 mb-10 ml-[250px]">
          <Headerbar />
          {renderComponentBasedOnRoute()}
        </div>
      </div>
    </>
  );
}

export default AdminHome;
