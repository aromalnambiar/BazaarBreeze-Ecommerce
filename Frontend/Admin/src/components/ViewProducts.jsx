import React, { useEffect, useState } from "react";
import photo from "../assets/images/Image2.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";

function ViewProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/admin/products`, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data.products);
        setProducts(res.data.products);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await axios.delete(`${BASE_URL}/admin/products/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        console.log(response);
        // alert("Deletion success");
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Not Success!",
          text: "Deletion not successful",
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
        <div className="h-full">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <div className="bg-white p-6 flex items-center justify-between py-8">
              <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search products..." />
              <h2 className="font-semibold text-gray-800 text-center mt-4">Products</h2>
              <div>
                <Link to={"/adminpanel/products/add"}>
                  <button className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Product</button>
                </Link>
              </div>
            </div>

            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">PRODUCTS</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">BRAND</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">TOTAL EARNINGS</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">ACTION</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {products.map((item, idx) => (
                      <tr key={item?._id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex flex-col">
                            <p className="text-gray-800 max-w-[250px] truncate">{item?.name}</p>
                            <small className="text-gray-800 max-w-[250px] truncate">{item?.description}</small>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left">{item?.brand || "0"}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left font-medium text-green-500">{item.totalEarnings || "0"}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <Link to={{ pathname: `/adminpanel/products/edit/${item._id}` }}>
                            <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md">Edit</button>
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ViewProducts;
