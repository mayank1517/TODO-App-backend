import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userID: {
    type: String,
    ref: "User",
    required: true,
  },
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Declined"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
