import axios from "axios";
import { BASE_URL } from "../../../User/config";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const name = useRef();
  const description = useRef();
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const deleteImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const addCategory = () => {
    const formData = new FormData();
    formData.append("name", name.current.value);
    formData.append("description", description.current.value);
    formData.append("image", image);

    const result = axios
      .post(`${BASE_URL}/admin/products/category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        name.current.value = "";
        description.current.value = "";
        setImage(null);
        setPreviewImage(null);
        console.log(res.data.message);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-w-[500px] mx-auto shadow-md bg-white rounded-lg border p-10 flex flex-col gap-4">
      <h1>Add Category</h1>
      <hr />
      <h3>Title</h3>
      <input ref={name} className="border-2 rounded-md p-2" type="text" placeholder="Enter category title" />
      <h3>Description</h3>
      <textarea ref={description} className="border-2 rounded-md p-2" name="description" id="" cols="30" rows="10" placeholder="Enter category description..."></textarea>
      <h3>Image</h3>
      {previewImage && (
        <div className="mb-4">
          <img src={previewImage} alt="Preview" className="max-w-full h-auto rounded-md" />
          <button onClick={deleteImage} className="text-red-500 mt-2 cursor-pointer">
            Delete Image
          </button>
        </div>
      )}
      <input type="file" onChange={handleImageChange} />
      <div className="flex gap-4">
        <button onClick={addCategory} className=" bg-[#696cff] text-white px-8 py-2 rounded-md ">
          Add
        </button>
        <button onClick={() => navigate("/category/view-all")} className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md ">
          Discard
        </button>
      </div>
    </div>
  );
}

export default AddCategory;
