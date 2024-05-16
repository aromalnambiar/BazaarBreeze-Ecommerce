import axios from "axios";
import { BASE_URL } from "../../config";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

  const addCategory = async () => {
    try {
      const categoryName = name.current.value.trim();
      const categoryDescription = description.current.value.trim();

      // Validate category name
      if (
        !categoryName ||
        categoryName.length > 15 ||
        /\d/.test(categoryName)
      ) {
        Swal.fire({
          title: "Invalid input!",
          text: "Category name must not be empty, contain numbers, or exceed 15 characters.",
          icon: "error",
        });
        return;
      }

      // Validate category description
      if (!categoryDescription || categoryDescription.length > 1000) {
        Swal.fire({
          title: "Invalid input!",
          text: "Category description must not be empty and should not exceed 1000 characters.",
          icon: "error",
        });
        return;
      }

      // Validate image
      if (!image) {
        Swal.fire({
          title: "Invalid input!",
          text: "Please select an image.",
          icon: "error",
        });
        return;
      }

      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You will be able to delete this category later!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add it!",
      });

      if (confirmed.isConfirmed) {
        const formData = new FormData();
        formData.append("name", categoryName);
        formData.append("description", categoryDescription);
        formData.append("image", image);

        const result = await axios.post(
          `${BASE_URL}/admin/categories`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${localStorage.getItem("adminToken")}`,
            },
          }
        );

        name.current.value = "";
        description.current.value = "";
        setImage(null);
        setPreviewImage(null);
        console.log(result.data.message);
        Swal.fire({
          title: "Added!",
          text: `${result.data.message}`,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Not Success!",
        text: "Category not Added Successfully!!!",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-[500px] mx-auto shadow-md bg-white rounded-lg border p-10 flex flex-col gap-4">
      <h1>Add Category</h1>
      <hr />
      <h3>Title</h3>
      <input
        ref={name}
        className="border-2 rounded-md p-2"
        type="text"
        placeholder="Enter category title"
      />
      <h3>Description</h3>
      <textarea
        ref={description}
        className="border-2 rounded-md p-2"
        name="description"
        id=""
        cols="30"
        rows="10"
        placeholder="Enter category description..."
      ></textarea>
      <h3>Image</h3>
      {previewImage && (
        <div className="mb-4">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full h-auto rounded-md"
          />
          <button
            onClick={deleteImage}
            className="text-red-500 mt-2 cursor-pointer"
          >
            Delete Image
          </button>
        </div>
      )}
      <input type="file" onChange={handleImageChange} />
      <div className="flex gap-4">
        <button
          onClick={addCategory}
          className=" bg-[#696cff] text-white px-8 py-2 rounded-md "
        >
          Add
        </button>
        <button
          onClick={() => navigate("/category/view-all")}
          className="bg-[#fedad4] py-2 px-6 text-red-600 rounded-md "
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default AddCategory;
