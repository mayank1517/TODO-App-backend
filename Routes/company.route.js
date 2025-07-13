import express from "express";
import upload from "../multer.js";
import {
  CompanyLogin,
  CompanyLogout,
  RegisterCompany,
} from "../Controller/company.controller.js";
import {
  postJob,
  getJobs,
  getJobById,
  getJobsByCompany,
  changeJobVisibility,
} from "../Controller/job.controller.js";
import { authenticationMiddleware } from "../Middleware/authorize.js";

const router = express.Router();

router.post("/company-register", upload.single("image"), RegisterCompany);
router.get("/company-login", CompanyLogin);
router.get("/company-logout", CompanyLogout);
router.post("/company-post-job", authenticationMiddleware, postJob);
router.get("/company-get-jobs", getJobs);
router.get("/company-get-job/:id", getJobById);
router.get(
  "/company-get-jobs-from-company",
  authenticationMiddleware,
  getJobsByCompany
);
router.post(
  "/company-change-job-visibility/:id",
  authenticationMiddleware,
  changeJobVisibility
);

export default router;
