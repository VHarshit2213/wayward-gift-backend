import mongoose from "mongoose";
import { ZodIPv4 } from "zod";

const UserSchema = new mongoose.Schema({

  name: {type: String, required: true},
  mobile: {type: String, required: false, unique: true},
  email: {type: String, required: true, unique: true},
  profilePicture: {type: String, required: false},
  password: {type: String, required: false},
  role: {type: String, default: "user"},
  isDeleted: {type: Boolean, default: false},
  isActive: {type: Boolean, default: true},
  googleId: {type: String, default: null},
  shippingAddress:[
    {
    streetAddress: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    ZIP: {type: String, required: true},
    country: {type: String, required: true},
  }],
  billingAddress:[
    {
    streetAddress: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    ZIP: {type: String, required: true},
    country: {type: String, required: true},
  }],

}, {
  timestamps: true,
});

export default mongoose.model("User", UserSchema);
