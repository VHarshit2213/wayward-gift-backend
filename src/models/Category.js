import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;
