import React, { useEffect, useState } from "react";
import photo from "../assets/images/image2.png";
import { Link } from "react-router-dom";
import EditCategory from "./EditCategory";
import axios from "axios";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [isListed, setIsListed] = useState(true);
  const [categoriesHolder, setCategoriesHolder] = useState([]);
  useEffect(() => {
    const result = axios
      .get(`${BASE_URL}/admin/categories`, {
        headers: {
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      })
      .then((res) => {
        // console.log(res.data.categories);
        setCategories(res.data.categories);
        setCategoriesHolder(res.data.categories);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [isEdit]);

  const handleEdit = (categoryId) => {
    setCategoryId(categoryId);
    setIsEdit(true);
  };
  const handleView = () => {
    console.log("IsListed : ", isListed);
    if (isListed) {
      setCategories(() => categoriesHolder.filter((category) => category.isListed));
    } else {
      setCategories(() => categoriesHolder.filter((category) => !category.isListed));
    }
    setIsListed((prev) => !prev);
  };
  console.log("categories : ", categories);
  return (
    <>
      {isEdit ? (
        <EditCategory categoryId={categoryId} setIsEdit={setIsEdit} />
      ) : (
        <section className="flex flex-col justify-center antialiased bg-gray-100 text-gray-600  p-4">
          <div className="h-full">
            <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
              <div className="bg-white p-6 flex items-center justify-between py-8">
                <input type="text" className="px-4 py-2 rounded-md border-2" placeholder="search products..." />
                <div>
                  <button onClick={() => setCategories(categoriesHolder)} className="border-[#afb0e1]  px-8 py-2 mr-4 rounded-md shadow-lg">
                    View all
                  </button>
                  <button onClick={handleView} className="border-[#afb0e1]  px-8 py-2 mr-4 rounded-md shadow-lg">
                    {isListed ? "View unlisted" : "View listed"}
                  </button>
                </div>
                <div>
                  <Link to={"/adminpanel/category/add"}>
                    <button className="bg-[#696cff] text-white px-8 py-2 rounded-md shadow-lg">Add Category</button>
                  </Link>
                </div>
              </div>

              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">CATEGORIES</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-left">TOTAL PRODUCTS</div>
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
                      {categories.map((item, idx) => (
                        <tr key={item?._id}>
                          <td className="p-2 whitespace-nowrap flex items-center gap-4 ">
                            <div className="w-[2.375rem] h-[2.375rem] rounded-full ms-4 overflow-hidden border">
                              <img src={`${BASE_URL}/uploads/${item.image}`} alt="" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[#696cff] max-w-[250px] truncate">{item.name}</p>
                              <small className="text-[#a1acb8] max-w-[250px] truncate">{item.description}</small>
                            </div>
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{item.totalProducts || "0"}</div>
                          </td>

                          <td className="p-2 whitespace-nowrap">
                            <div className="text-left">{item.totalEarnings || "0"}</div>
                          </td>
                          <td className="p-2 whitespace-nowrap flex justify-center">
                            <button onClick={() => handleEdit(item._id)} className="bg-[#d4f7fe] py-2 px-6  text-blue-800 rounded-md ">
                              Edit
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
      )}
    </>
  );
}

export default CategoryList;
