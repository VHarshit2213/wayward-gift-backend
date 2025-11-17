import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  name: {type: String, required: true},
  mobile: {type: String, required: false, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: false},
  role: {type: String, default: "user"},
  isDeleted: {type: Boolean, default: false},
  isActive: {type: Boolean, default: true},
  googleId: {type: String, default: null},

}, {
  timestamps: true,
});

export default mongoose.model("User", UserSchema);
