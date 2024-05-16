const Category = require("../../models/Category.js");
const cloudinary = require("../../utils/cloudinary.js");

const addFileName = (originalName, fileName) => {
  const parts = originalName.split(".");
  const extension = parts[parts.length - 1];
  const imageName = `${fileName}.${extension}`;
  return imageName;
};

function removeExtension(url) {
  const dotIndex = url.lastIndexOf(".");

  if (dotIndex !== -1) {
    return url.slice(0, dotIndex);
  } else {
    return url;
  }
}
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryExist = await Category.findOne({ name });
    console.log("category : ", req.file);
    if (categoryExist) {
      return res.status(400).json({ message: "Category already exist" });
    }
    const imageName = addFileName(req.file.originalname, req.file.filename);
    const category = new Category({
      name,
      description,
      createdDate: Date.now(),
      updatedDate: null,
      image: imageName,
      publicId: req.file.path,
    });
    await category.save();
    res.status(201).json({ message: "Succes, category added" });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

const editCategory = async (req, res) => {
  try {
    const { name, description, isListed } = req.body;
    const { categoryId } = req.params;

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const image = req.file
      ? addFileName(req.file.originalname, req.file.filename)
      : existingCategory.image;

    const updatedData = {
      name: name || existingCategory.name,
      description: description || existingCategory.description,
      isListed: isListed || existingCategory.isListed,
      image,
      publicId: req.file.path,
    };
    const newCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      updatedData,
      { new: true }
    );

    // Delete the old category image from Cloudinary
    if (req.file && existingCategory.publicId) {
      await cloudinary.uploader.destroy(
        removeExtension(existingCategory.image),
        function (error, result) {
          console.log(result, error);
        }
      );
    }

    res
      .status(201)
      .json({ message: "Updated successfully", category: newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewCategories = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalCategories = await Category.countDocuments();
    const categories = await Category.find().skip(startIndex).limit(limit);

    res.status(200).json({ message: "success", categories, totalCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewCategory = async (req, res) => {
  try {
    console.log(req.params);
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    res.status(200).json({ message: "success", category });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = {
  addCategory,
  editCategory,
  viewCategories,
  viewCategory,
};
