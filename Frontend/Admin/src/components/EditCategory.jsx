import axios from "axios";
import { BASE_URL } from "../../config";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditCategory({ categoryId, setIsEdit }) {
  const name = useRef();
  const description = useRef();
  const imageInput = useRef();
  const [currentImage, setCurrentImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [isListed, setIsListed] = useState(true); // Step 1
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/categories/${categoryId}`, {
          headers: {
            Authorization: `${localStorage.getItem("adminToken")}`,
          },
        });
        const fetchedCategory = response.data.category;
        console.log("fetchedCategory : ", fetchedCategory.isListed);
        name.current.value = fetchedCategory.name || "";
        description.current.value = fetchedCategory.description || "";
        setCurrentImage(fetchedCategory.image || null);
        setIsListed(fetchedCategory.isListed); // Set the default value
        // console.log(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewImagePreview(URL.createObjectURL(selectedImage));
  };

  const editSubmit = async () => {
    try {
      const updatedName = name.current.value.trim();
      const updatedDescription = description.current.value.trim();

      // Validate updated category name
      if (!updatedName || updatedName.length > 15 || /\d/.test(updatedName)) {
        Swal.fire({
          title: "Invalid input!",
          text: "Category name must not be empty, contain numbers, or exceed 15 characters.",
          icon: "error",
        });
        return;
      }

      // Validate updated category description
      if (!updatedDescription || updatedDescription.length > 1000) {
        Swal.fire({
          title: "Invalid input!",
          text: "Category description must not be empty and should not exceed 1000 characters.",
          icon: "error",
        });
        return;
      }

      

      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("description", updatedDescription);
      formData.append("isListed", isListed);

      if (imageInput.current.files[0]) {
        formData.append("image", imageInput.current.files[0]);
      }

      // Make a PUT request to update the category
      const response = await axios.put(`${BASE_URL}/admin/categories/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("adminToken")}`,
        },
      });

      console.log(response.data.message);
      setCurrentImage(newImagePreview);
      setNewImagePreview(null);
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("isListed : ", isListed);

  return (
    <div className="max-w-[500px] mx-auto shadow-md bg-white rounded-lg border p-10 flex flex-col gap-4">
      <h1>Edit Category</h1>
      <hr />
      <h3>Title</h3>
      <input ref={name} className="border-2 rounded-md p-2" type="text" placeholder="Enter category title" />
      <h3>Description</h3>
      <textarea ref={description} className="border-2 rounded-md p-2" name="description" id="" cols="30" rows="10" placeholder="Enter category description..."></textarea>
      <div className="mb-4">
        <h3>Current Image</h3>
        {currentImage && <img src={`${BASE_URL}/uploads/${currentImage}`} alt="Current Category" className="max-w-full h-auto rounded-md border border-gray-300" />}
      </div>
      <h3>New Image</h3>
      <input ref={imageInput} type="file" onChange={handleImageChange} />
      {newImagePreview && (
        <div className="mb-4">
          <h3>New Image Preview</h3>
          <img src={newImagePreview} alt="New Category" className="max-w-full h-auto rounded-md border border-gray-300" />
        </div>
      )}
      <div className="mb-4">
        <label>
          <input type="checkbox" checked={isListed} onChange={() => setIsListed(!isListed)} />
          Is Listed
        </label>
      </div>
      <div className="flex gap-4">
        <button onClick={editSubmit} className="bg-[#696cff] text-white px-8 py-2 rounded-md ">
          Submit
        </button>
        <button
          onClick={() => {
            setIsEdit(false);
          }}
          className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md "
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default EditCategory;
