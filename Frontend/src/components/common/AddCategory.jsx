import axios from "axios";
import { BASE_URL } from "../../../config";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const name = useRef();
  const description = useRef();
  const navigate=useNavigate();
  
  const addCategory = () => {
    const result = axios
      .post(`${BASE_URL}/admin/products/category`, {
        name: name.current.value,
        description: description.current.value,
      })
      .then((res) => {
        name.current.value = "";
        description.current.value = "";
        console.log(res.data.message);
        alert(res.data.message);
        // alert();
      })
      .catch((err) => {
        console.log(err);
      });
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
        <button onClick={addCategory} className=" bg-[#696cff] text-white px-8 py-2 rounded-md ">
          Add
        </button>
        <button onClick={()=>navigate('/admin/categories')} className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">Discard</button>
      </div>
    </div>
  );
}

export default AddCategory;
