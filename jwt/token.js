import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
export const genrateToken = async (userID, res) => {
  const token = jwt.sign({ userID }, process.env.jwtKEY, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  await User.findByIdAndUpdate(userID, { token });
  await Company.findByIdAndUpdate(userID, { token });
  return token;
};
