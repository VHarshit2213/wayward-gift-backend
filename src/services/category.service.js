import Category from "../models/Category.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export async function createCategory({ name }, files, req) {
  let image = req.files?.['image']?.[0];

if (!name) {
    throw new Error('Name is required');
} else if (!image) {
    throw new Error('Image is required');
}
  const userId = req.user._id; // from JWT
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Only admin can create categories");

  const exists = await Category.findOne({ name });
  if (exists) throw new Error("Category already exists with this name");

  const newCategory = await Category.create({
    name,
    image: image.filename,
  });

  // Attach URL
  newCategory.image = `${req.protocol}://${req.get("host")}/uploads/${newCategory.image}`;
  return newCategory;
}

export async function getCategory(categoryId, req) {
  if (categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId))
      throw new Error("Please provide valid category id");

    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");

    if (category.image) {
      category.image = `${req.protocol}://${req.get("host")}/uploads/${category.image}`;
    }
    return category;
  }

  const categories = await Category.find();
  categories.forEach((cat) => {
    if (cat.image) {
      cat.image = `${req.protocol}://${req.get("host")}/uploads/${cat.image}`;
    }
  });
  return categories;
}
export const updateCategory = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    if (!mongoose.Types.ObjectId.isValid(categoryId))
      throw new Error("Please provide valid category id");
    const userId = req.user._id; // from JWT
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Only admin can update categories");
    const image = req.files?.['image']?.[0]; // multer stores files in array

    if (!categoryId) {
      throw new Error("Category id is required");
    } else if (!name) {
      throw new Error("Name is required");
    }

    const categoryById = await Category.findOne({ _id: categoryId });
    if (!categoryById) throw new Error("Category not found");

    // check if another category with same name exists (excluding current id)
    const categoryByName = await Category.findOne({
      name: name,
      _id: { $ne: categoryId },
    });
    if (categoryByName) throw new Error("Category already exists for this name");

    // keep old image if no new one provided
    const updatedImage = image ? image.filename : categoryById.image;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          name: name,
          image: updatedImage,
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );

    return updatedCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function deleteCategory(categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId))
    throw new Error("Provide valid category id");

  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Only admin can delete categories");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  await Category.findByIdAndDelete(categoryId);
  return category;
}


export async function getAllCategoryDetails(req) {
  const categories = await Category.find();
  categories.forEach((cat) => {
    if (cat.image) {
      cat.image = `${req.protocol}://${req.get("host")}/uploads/${cat.image}`;
    }
  });
  return categories;
};