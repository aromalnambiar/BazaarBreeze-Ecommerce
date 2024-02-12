import React, { useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
// import User from "../../assets/icons/User.svg";
import user from "../../assets/icons/user.png";
import axios from "axios";
import { BASE_URL } from "../../../config";

function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState({});
  const username = useRef();
  const email = useRef();
  const age = useRef();
  const genderSelect = useRef();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // console.log("res : ", );
        const user = res.data.user;
        setUser(res.data.user);
        username.current.value = user.username;
        email.current.value = user.email;
        age.current.value = user.age;
        genderSelect.current.value = user.gender;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("userid", userId);
    formData.append("age", age.current.value);
    formData.append("gender", genderSelect.current.value);
    formData.append("username", username.current.value);
    console.log("gender : ", genderSelect.current.value);
    formData.append("image", profileImage);
    console.log("image : ", profileImage);

    axios
      .put(`${BASE_URL}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        alert("User data updated successfully");
        console.log("res : ", res);
        setIsEditing(false); // Turn off edit mode after successful submission
      })
      .catch((err) => {
        console.error("Error updating user data", err);
      });

    // For demonstration purposes, log the user data to the console
    console.log("Submitted User Data:", user);
  };

  console.log(user);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

      <div className="flex items-center space-x-4">
        <div className="w-1/4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
            <div className="mt-1 flex items-center justify-center">
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Profile" className="w-24 h-24 rounded-full" />
                </>
              ) : (
                <img src={`${BASE_URL}/uploads/${user.image}` || user} alt="Profile" className="w-24 h-24 rounded-full" />
              )}
              <input type="file" id="profileImage" name="profileImage" className="hidden" onChange={handleImageChange} />
            </div>
          </label>
        </div>

        <div className="w-3/4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input type="text" id="name" ref={username} name="name" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email" id="email" ref={email} name="email" className="mt-1 p-2 w-full border rounded-md" disabled />
          </div>

          <div>
            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input ref={age} type="tel" id="phone1" name="phone1" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select id="gender" name="gender" ref={genderSelect} value={user.gender || ""} className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSubmit();
            }
            setIsEditing(!isEditing);
          }}
          className={`px-4 py-2 ${isEditing ? "bg-red-500 text-white" : "bg-blue-500 text-white"} rounded-md transition duration-300 hover:bg-opacity-80`}
        >
          {isEditing ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
