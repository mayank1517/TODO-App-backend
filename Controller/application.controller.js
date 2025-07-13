import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  const jobID = req.params.id;
  const userID = req.user._id;
  try {
    const isAlreadyApplied = await Application.find({
      jobID,
      userID,
    });
    if (isAlreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }
    const jobdata = await Job.findById(jobID);
    if (!jobdata) {
      return res.status(404).json({ message: "Job not found" });
    }
    await Application.create({
      companyID: jobdata.companyID,
      userID,
      jobID,
    });
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserApplicationsForJob = async (req, res) => {
  const userID = req.user._id;
  try {
    console.log(userID);
    const applications = await Application.find()
      .populate({
        path: "userID",
        select: "-password",
      })
      .populate({
        path: "companyID",
        select: "-password",
      })
      .exec();
    console.log(applications);
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications for job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
