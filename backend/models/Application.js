import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  status: {
    type: String,
    enum: ["READY", "SUBMITTED", "FAILED"],
    default: "READY",
  },
  applicationPayload: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", ApplicationSchema);
