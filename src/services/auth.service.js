import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";
import { registrationEmailTemplate } from "../utils/emailTemplates.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// JWT helper
const signToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Register
export async function register({ name, email, mobile, password }) {
  const exists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (exists) {
    const err = new Error("Email or mobile already in use");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10
  );

  const user = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    role: "user", // explicitly set or default in model
    isDeleted: false,
    isActive: true,
  });

  const token = signToken(user);

  await sendMail({
          to: user.email,
          subject: "Welcome to Wayward Gifts & Crafts 🎉",
          html: registrationEmailTemplate(user.name || "User"),
        });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  };
}

// Login
export async function login({ email, password }) {
  const user = await User.findOne({ email }).select(
    "name email role password isActive isDeleted mobile"
  );

  if (!user) {
    const err = new Error("User not found with this email");
    err.status = 401;
    throw err;
  }

  if (user.isDeleted || !user.isActive) {
    const err = new Error("Account is inactive or deleted");
    err.status = 403;
    throw err;
  }

   if (!user.password) {
    const err = new Error("This account uses Google Sign-In. Please log in with Google.");
    err.status = 400;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  };
}


// google login
export async function googleLogin(idToken) {
  // 1. Verify token from frontend
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  if (!email) {
    const err = new Error("Google login failed: No email found");
    err.status = 400;
    throw err;
  }

  // 2. Check if user already exists in DB
  let user = await User.findOne({ email });

  if (!user) {
    // 3. If not, create a new user account
    user = await User.create({
      name,
      email,
      mobile: null,
      password: null, // since Google login
      role: "user",
      isDeleted: false,
      isActive: true,
      googleId,
    });
  }

  if (user.isDeleted || !user.isActive) {
    const err = new Error("Account is inactive or deleted");
    err.status = 403;
    throw err;
  }

  // 4. Generate JWT
  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  };
}