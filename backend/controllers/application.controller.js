import Application from '../models/Application.js';
import Job from '../models/Job.js';

// 1. Get a Single Application Details
export const getApplication = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ msg: 'Application not found' });
        
        const job = await Job.findById(app.jobId);

        res.json({
            application: app,
            applyUrl: job ? job.applyUrl : null
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 2. Get User's Application History (Kanban Board Data)
export const getHistory = async (req, res) => {
    try {
        // Get User ID from the URL query (e.g., ?userId=12345)
        const { userId } = req.query;

        console.log("📥 Fetching history for User:", userId);

        if (!userId) {
            return res.status(400).json({ msg: "User ID missing" });
        }

        // Find applications matching THIS user & Populate Job Details
        const apps = await Application.find({ userId })
            .populate('jobId', 'title company location type postedAt description applyUrl') 
            .sort({ createdAt: -1 }); // Newest first

        console.log(`✅ Found ${apps.length} applications`);
        res.json(apps);

    } catch (err) {
        console.error("Fetch History Error:", err);
        res.status(500).send('Server Error');
    }
};

// 3. Save a Job (Swipe Right)
export const saveApplication = async (req, res) => {
    try {
        const { userId, jobData } = req.body;

        console.log("📥 Received Save Request:", jobData?.title);

        if (!userId) return res.status(400).json({ success: false, msg: "User ID missing" });
        if (!jobData) return res.status(400).json({ success: false, msg: "Job data missing" });

        let jobId;

        // --- STEP A: Handle Job Creation (if external) ---
        if (jobData._id && (jobData._id.toString().startsWith('linkedin_') || jobData._id.toString().startsWith('ext_'))) {
            
            // Check if job already exists in DB (by URL) to avoid duplicates
            let existingJob = await Job.findOne({ applyUrl: jobData.applyUrl });

            if (existingJob) {
                jobId = existingJob._id;
            } else {
                // Create new Job in DB
                // 🔥 IMPORTANT: We provide fallback strings (|| "...") to prevent DB Validation Errors
                const newJob = new Job({
                    title: jobData.title || "Unknown Role",
                    company: jobData.company || "Unknown Company",
                    location: jobData.location || "Remote",
                    type: jobData.type || "Full-time",
                    description: jobData.description || "Click 'Apply' to view full details on LinkedIn.", 
                    applyUrl: jobData.applyUrl,
                    salary: jobData.salary || "Not specified",
                    postedAt: jobData.postedAt || new Date()
                });

                const savedJob = await newJob.save();
                jobId = savedJob._id;
            }
        } else {
            // It's already an internal job ID
            jobId = jobData._id;
        }

        // --- STEP B: Handle Application Creation ---
        
        // Check if User already applied/saved this job
        const existingApp = await Application.findOne({ userId, jobId });
        if (existingApp) {
            return res.status(400).json({ success: false, msg: "You have already applied to this job" });
        }

        // Create Application -> DEFAULT STATUS: 'APPLIED'
        const newApp = new Application({
            userId,
            jobId,
            status: 'APPLIED', 
            applicationPayload: {} 
        });

        await newApp.save();

        res.json({ success: true, msg: "Marked as Applied!", applicationId: newApp._id });

    } catch (err) {
        console.error("❌ Save Error:", err);
        res.status(500).json({ success: false, msg: `Server Error: ${err.message}` });
    }
};

// 4. Update Status (Drag & Drop)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params; // Application ID
        const { status } = req.body;

        console.log(`🔄 Moving Application ${id} to status: ${status}`);

        // Validate Status matches the new Schema Enum
        const validStatuses = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status" });
        }

        const updatedApp = await Application.findByIdAndUpdate(
            id, 
            { status: status },
            { new: true } // Return the updated document
        );

        if (!updatedApp) {
            return res.status(404).json({ success: false, msg: "Application not found" });
        }

        console.log("✅ Database Updated Successfully");
        res.json({ success: true, application: updatedApp });

    } catch (err) {
        console.error("❌ Update Status Error:", err);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedApp = await Application.findByIdAndDelete(id);

        if (!deletedApp) {
            return res.status(404).json({ success: false, msg: "Application not found" });
        }

        res.json({ success: true, msg: "Application removed successfully" });

    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};