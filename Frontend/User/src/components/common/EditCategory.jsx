import axios from "axios";
import { BASE_URL } from "../../../config";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditCategory({ categoryId, setIsEdit }) {
  const name = useRef();
  const description = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/products/category/${categoryId}`);
        const fetchedCategory = response.data.category;
        name.current.value = fetchedCategory.name || "";
        description.current.value = fetchedCategory.description || "";
        console.log(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [categoryId]);

  const editSubmit = async () => {
    try {
      const updatedName = name.current.value;
      const updatedDescription = description.current.value;

      // Make a PUT request to update the category
      const response = await axios.put(`${BASE_URL}/admin/products/category/${categoryId}`, {
        name: updatedName,
        description: updatedDescription,
      });

      console.log(response.data.message);
      // console.log(response.data.category);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto shadow-md  bg-white rounded-lg border p-10 flex flex-col gap-4">
      <h1>Add Category</h1>
      <hr />
      <h3>Title</h3>
      <input ref={name} className="border-2 rounded-md p-2" type="text" placeholder="Enter category title" />
      <h3>Description</h3>
      <textarea ref={description} className="border-2 rounded-md p-2" name="description" id="" cols="30" rows="10" placeholder="Enter category description..."></textarea>
      <div className="flex gap-4">
        {/* <button>Add</button> */}
        <button onClick={editSubmit} className=" bg-[#696cff] text-white px-8 py-2 rounded-md ">
          Submit
        </button>
        <button onClick={() => setIsEdit(false)} className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">
          Discard
        </button>
      </div>
    </div>
  );
}

export default EditCategory;
