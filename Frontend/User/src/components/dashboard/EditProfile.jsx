import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import User from "../../assets/icons/User.svg";

function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

      <div className="flex items-center space-x-4">
        <div className="w-1/4">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
            <div className="mt-1 flex items-center justify-center">
              {profileImage ? (
                <>
                  <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full" />
                </>
              ) : (
                <FaUserPlus className="text-8xl" />
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
            <input type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>

          <div>
            <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">
              Phone 1
            </label>
            <input type="tel" id="phone1" name="phone1" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>

          <div>
            <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">
              Phone 2
            </label>
            <input type="tel" id="phone2" name="phone2" className="mt-1 p-2 w-full border rounded-md" disabled={!isEditing} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 ${isEditing ? "bg-red-500 text-white" : "bg-blue-500 text-white"} rounded-md transition duration-300 hover:bg-opacity-80`}>
          {isEditing ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
