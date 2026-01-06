import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  status: {
    type: String,
    enum: ["APPLIED", "INTERVIEW", "REJECTED", "OFFER"],
    default: "APPLIED",
  },
  applicationPayload: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", ApplicationSchema);
