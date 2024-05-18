const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const path = require("path");

const storage = (folderName) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: "ecommerce/" + folderName,
        public_id: file.originalname + "-" + Date.now(),
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
      };
    },
  });

const uploadSingle = (folderName) =>
  multer({ storage: storage(folderName) }).single("image");

const uploadArray = (folderName) =>
  multer({ storage: storage(folderName) }).array("photos", 12);

module.exports = { uploadSingle, uploadArray };
