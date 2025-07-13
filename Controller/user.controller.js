import User from "../models/user.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { genrateToken } from "../jwt/token.js";
import { v2 as Cloudinary } from "cloudinary";
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username is required and must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const RegiterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const validation = userSchema.safeParse({ username, email, password });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      const token = genrateToken(newUser._id, res);
      res.status(201).json(token);
    }
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    User.findOne({ email })
      .then(async (user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }
        const token = genrateToken(user._id, res);
        return res.status(200).json({ message: "Login successful", user });
      })
      .catch((error) => {
        console.error("Error finding user:", error);
        return res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(201).json({ message: "user logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out user" });
  }
};
export const updateResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.resumeFile;
    if (!resumeFile) {
      return res.status(400).json({ message: "Resume is required" });
    }
    const userData = await User.findById(userId);
    if (resumeFile) {
      const resumeUpload = await Cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }
    await userData.save();
    return res.status(200).json({ message: "resume uploaded" });
  } catch (error) {
    console.error("Error updating resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { userLogin, userLogout };
export { RegiterUser as RegisterUser };
