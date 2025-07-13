import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
  const CompanyID = req.company._id;
  try {
    const { title, location, description, salary } = req.body;
    const newJob = new Job({
      title,
      location,
      description,
      salary,
      companyID: CompanyID,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating new job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyID",
      select: "-password",
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: "companyID",
      select: "-password",
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getJobsByCompany = async (req, res) => {
  try {
    const companyID = req.company._id;
    const jobs = await Job.find({ companyID, visible: true }).populate({
      path: "companyID",
      select: "-password",
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs for Company:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const companyID = req.company._id;
    const job = await Job.findById(id);
    if (companyID.toString() === job.companyID.toString()) {
      job.visible = !job.visible;
      await job.save();
      res.json(job);
    } else {
      console.log(companyID.toString(), job.companyID.toString());
      return res
        .status(403)
        .json({ message: "Unauthorized to change visibility of this job" });
    }
  } catch (error) {
    console.error("Error changing job visibility:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
