import React, { useEffect, useState } from "react";
import photo from "../assets/images/Image2.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

function ViewProducts() {
  const [isEdit, setIsEdit] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/admin/products`)
      .then((res) => {
        console.log(res.data.products);
        setProducts(res.data.products);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure ?.")) {
      const result = axios
        .delete(`${BASE_URL}/admin/products/${id}`)
        .then((res) => {
          console.log(res);
          alert("Deletion success");
        })
        .catch((res) => {
          console.log(res);
          alert("Deletion not success");
        });
    }
  };

  return (
    <>
      <div className=" border border-gray-300 overflow-hidden shadow-md rounded-2xl mb-20">
        <div className="bg-white p-6 flex justify-between py-8">
          <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search products..." />
          <div>
            <Link to={"/products/add"}>
              <button className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Product</button>
            </Link>
          </div>
        </div>
        <table className="min-w-full bg-white ">
          <thead>
            <tr className="text-[#566a7f] border-t ">
              <th className="py-2 text-start pl-8 font-medium border-b">PRODUCTS</th>
              <th className="py-2 text-start pl-4 font-medium border-b">BRAND</th>
              <th className="py-2 text-start pl-4 font-medium border-b">TOTAL EARNINGS</th>
              <th className="py-2 text-start pl-4 font-medium border-b">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="text-[#697a8d]">
                <td className="py-2 px-4 border-b flex items-center gap-4 ">
                  <div className="w-[2.375rem] h-[2.375rem] rounded-full ms-4 overflow-hidden border">
                    <img src={photo} alt="" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#696cff] max-w-[250px] truncate">{item.name}</p>
                    <small className="text-[#a1acb8] max-w-[250px] truncate">{item.description}</small>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{item.brand || "0"}</td>
                <td className="py-2 px-4 border-b">{item.totalEarnings || "0"}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-[#d4f7fe] py-2 px-6 mr-4 text-blue-800 rounded-md ">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewProducts;
