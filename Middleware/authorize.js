import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

export const authenticationMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.jwtKEY);
    const user = verifiedUser.userID;
    req.user = await User.findById(user);
    req.company = await Company.findById(user);
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }

  next();
};
