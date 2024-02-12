import { Link } from "react-router-dom";
function Headerbar() {
  return (
    <>
      {/* <div className="h-16 rounded-md shadow-md border  mt-4 mb-12 bg-white"></div> */}
      <header className="bg-green-500 flex items-center text-white h-16 rounded-md shadow-md border  mt-4 mb-12 ">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/products" className="hover:text-gray-300">
              Products
            </Link>
            <Link to="/categories" className="hover:text-gray-300">
              Categories
            </Link>
            <Link to="/users" className="hover:text-gray-300">
              Users
            </Link>
            {/* Add more navigation links as needed */}
          </nav>
          <div className="flex items-center">
            <div className="mr-4">
              {/* Add user profile image or icon */}
              <img src="https://via.placeholder.com/32" alt="User Avatar" className="rounded-full" />
            </div>
            <div>
              {/* Add user information or dropdown */}
              <p className="font-semibold">Admin User</p>
              <button className="text-sm text-blue-200 hover:text-gray-300">Logout</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Headerbar;
