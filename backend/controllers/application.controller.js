import Application from "../models/Application.js";
import Job from "../models/Job.js";

// 1. Get a Single Application Details
export const getApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    const job = await Job.findById(app.jobId);

    res.json({
      application: app,
      applyUrl: job ? job.applyUrl : null,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "User ID missing" });
    }
    const apps = await Application.find({ userId })
      .populate(
        "jobId",
        "title company location type postedAt description companyLogo applyUrl"
      )
      .sort({ createdAt: -1 }); // Newest first

    res.json(apps);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const saveApplication = async (req, res) => {
  try {
    const { userId, jobData } = req.body;

    if (!userId)
      return res.status(400).json({ success: false, msg: "User ID missing" });
    if (!jobData)
      return res.status(400).json({ success: false, msg: "Job data missing" });

    let jobId;

    if (
      jobData._id &&
      (jobData._id.toString().startsWith("linkedin_") ||
        jobData._id.toString().startsWith("ext_"))
    ) {
      let existingJob = await Job.findOne({ applyUrl: jobData.applyUrl });

      if (existingJob) {
        jobId = existingJob._id;
      } else {
        const newJob = new Job({
          title: jobData.title || "Unknown Role",
          company: jobData.company || "Unknown Company",
          location: jobData.location || "Remote",
          type: jobData.type || "Full-time",
          description:
            jobData.description ||
            "Click 'Apply' to view full details on LinkedIn.",
          applyUrl: jobData.applyUrl,
          companyLogo: jobData.logo || "",
          salary: jobData.salary || "Not specified",
          postedAt: jobData.postedAt || new Date(),
        });

        const savedJob = await newJob.save();
        jobId = savedJob._id;
      }
    } else {
      jobId = jobData._id;
    }

    const existingApp = await Application.findOne({ userId, jobId });
    if (existingApp) {
      return res
        .status(400)
        .json({ success: false, msg: "You have already applied to this job" });
    }

    const newApp = new Application({
      userId,
      jobId,
      status: "APPLIED",
      applicationPayload: {},
    });

    await newApp.save();

    res.json({
      success: true,
      msg: "Marked as Applied!",
      applicationId: newApp._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: `Server Error: ${err.message}` });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;

    const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, msg: "Invalid status" });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } 
    );

    if (!updatedApp) {
      return res
        .status(404)
        .json({ success: false, msg: "Application not found" });
    }

    res.json({ success: true, application: updatedApp });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApp = await Application.findByIdAndDelete(id);

    if (!deletedApp) {
      return res
        .status(404)
        .json({ success: false, msg: "Application not found" });
    }

    res.json({ success: true, msg: "Application removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
