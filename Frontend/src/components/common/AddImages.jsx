import React, { useState } from "react";

const AddImages = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file && images.length < 8) {
      setImages([...images, URL.createObjectURL(file)]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-md shadow-md mt-8">
      <label className="block text-lg font-bold mb-4">Add Images</label>
      <div className="flex flex-wrap gap-4 justify-around">
        {images.map((image, index) => (
          <div key={index} className="mb-4 flex items-center">
            <img src={image} alt={`Image ${index + 1}`} className="w-16 h-16 object-cover mr-4" />
            <button onClick={() => handleRemoveImage(index)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
              Remove
            </button>
          </div>
        ))}
      </div>

      {images.length < 8 && (
        <label className="cursor-pointer flex justify-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <div className="bg-gray-200 w-16 h-16 flex items-center justify-center rounded-md cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 110-18 9 9 0 010 18zm5.707-12.293a1 1 0 01-1.414 1.414L11 8.414V14a1 1 0 11-2 0V8.414L5.707 7.121a1 1 0 10-1.414 1.414L10 15.414l5.707-5.707a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </label>
      )}
    </div>
  );
};

export default AddImages;
