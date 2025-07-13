import Company from "../models/company.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { genrateToken } from "../jwt/token.js";
import { v2 } from "cloudinary";

const companySchema = z.object({
  name: z
    .string()
    .min(3, "name is required and must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const RegisterCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    const existingCompany = await Company.find({ email });
    if (existingCompany.length > 0) {
      return res.status(400).json({ message: "Company already exists" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const imagePath = await v2.uploader.upload(imageFile.path);
    const validation = companySchema.safeParse({
      name,
      email,
      password,
    });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      image: imagePath.secure_url,
    });
    if (newCompany) {
      const token = genrateToken(newCompany._id, res);
      res.status(201).json(token);
    }
    await newCompany.save();
    res
      .status(201)
      .json({ message: "Company registered successfully", newCompany });
  } catch (error) {
    console.error("Error registering Company:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const CompanyLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    Company.findOne({ email })
      .then(async (Company) => {
        if (!Company) {
          return res.status(404).json({ message: "Company not found" });
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          Company.password
        );
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }
        const token = genrateToken(Company._id, res);
        return res.status(200).json({ message: "Login successful", Company });
      })
      .catch((error) => {
        console.error("Error finding Company:", error);
        return res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.error("Error logging in Company:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const CompanyLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(201).json({ message: "Company logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out Company" });
  }
};
export { CompanyLogin, CompanyLogout };
export { RegisterCompany as RegisterCompany };
