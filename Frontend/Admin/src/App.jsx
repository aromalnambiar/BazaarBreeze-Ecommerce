import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSignIn from "./components/AdminSignin";
import ViewProducts from "./components/ViewProducts";
import AddProduct from "./components/AddProduct";
import CategoryList from "./components/CategoryList";
import EditCategory from "./components/EditCategory";
import AddCategory from "./components/AddCategory";
import UsersList from "./components/UsersList";
import UserDetails from "./components/UserDetails";
import Sidebar from "./components/common/Sidebar";
import Headerbar from "./components/common/Headerbar";
import store from "./redux/store/configureStore";
import { Provider, useSelector } from "react-redux";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <div className="grid gap-8 grid-cols-12 pr-10 min-h-screen h-full bg-[#f5f5f9]">
            <Sidebar />
            <div className="col-span-12 mb-10 ml-[250px]">
              <Headerbar />
              <Routes>
                <Route path="/" element={<AdminSignIn />} />
                <Route path="/products/view-all" element={<ViewProducts />} />
                {/* <Route path="/products/view" element={<AdminSignIn />} /> */}
                {/* <Route path="/products/edit" element={<AdminSignIn />} /> */}
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/category/view-all" element={<CategoryList />} />
                <Route path="/category/add" element={<AddCategory />} />
                <Route path="/users/view-all" element={<UsersList />} />
                <Route path="/users/view" element={<UserDetails />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
