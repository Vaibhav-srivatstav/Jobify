import Job from "../models/Job.js";
import Application from "../models/Application.js";
import CandidateProfile from "../models/CandidateProfile.js";
import linkedIn from "linkedin-jobs-api";

// --- CONSTANTS: SKILL EXTRACTION LIST ---
const SKILL_KEYWORDS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "NestJS",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Java",
  "Spring Boot",
  "C++",
  "C#",
  ".NET",
  "Go",
  "Rust",
  "PHP",
  "Laravel",
  "Ruby",
  "Rails",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "Prisma",
  "Mongoose",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Jenkins",
  "CI/CD",
  "DevOps",
  "Git",
  "GitHub",
  "GitLab",
  "Jira",
  "Agile",
  "Scrum",
  "HTML",
  "CSS",
  "Tailwind",
  "Sass",
  "Material UI",
  "Bootstrap",
  "Redux",
  "GraphQL",
  "REST API",
  "Machine Learning",
  "AI",
  "Data Science",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "PyTorch",
];

const extractSkills = (text) => {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  // Return unique skills found in text
  return [
    ...new Set(
      SKILL_KEYWORDS.filter((skill) => lowerText.includes(skill.toLowerCase()))
    ),
  ];
};

function capitalize(str) {
  if (!str) return "Full-time";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const searchLinkedIn = async (req, res) => {
  try {
    // 1. Get frontend params
    // 'page' here acts as our 'start index' (0, 20, 40...)
    const { keyword, location, jobType, remoteFilter, page = 0 } = req.body;

    console.log(
      `🚀 Fetching LinkedIn Batch | Start Index: ${page} | Limit: 20`
    );

    const queryOptions = {
      keyword: keyword || "Software Engineer",
      location: location || "India",
      dateSincePosted: "past Week",
      jobType: jobType === "all" ? "" : jobType || "full time",
      remoteFilter: remoteFilter === "all" ? "" : remoteFilter || "remote",
      experienceLevel: "entry level",
      limit: "20", // 🔥 Exactly 20 jobs
      page: page, // 🔥 Thanks to our fix, this is now the raw Start Index (0, 20, 40)
      sortBy: "recent",
    };

    const response = await linkedIn.query(queryOptions);

    if (!response || response.length === 0) {
      return res.json({
        success: false,
        msg: "No more jobs found",
        jobs: [],
        nextPage: null,
      });
    }

    // 3. Map & Clean Data
    const cleanedJobs = response.map((job) => ({
      _id:
        "linkedin_" + (job.jobUrl ? job.jobUrl.split("?")[0] : Math.random()), // Generate stable ID from URL
      title: job.position,
      company: job.company,
      location: job.location,
      type: "Full-time",
      description: "View full details on LinkedIn...",
      applyUrl: job.jobUrl,
      postedAgo: job.agoTime,
      logo: job.companyLogo,
      salary: job.salary,
      postedAt: job.date,
      source: "LinkedIn",
      requiredSkills: [],
    }));


    res.json({
      success: true,
      jobs: cleanedJobs,
      // Tell frontend where to start next time (Current + 20)
      nextPage: parseInt(page) + 20,
    });
  } catch (error) {
    console.error("Scraper Error:", error);
    res.status(500).json({ success: false, msg: "Failed to fetch jobs" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 }).limit(20);
    res.json(jobs);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const swipeRight = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    if (
      jobId.toString().startsWith("ext_") ||
      jobId.toString().startsWith("backup_")
    ) {
      return res.status(400).json({
        msg: "Cannot swipe on external jobs. Please apply on LinkedIn.",
      });
    }

    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    const applicationPayload = {
      fullName: profile.name,
      email: profile.email,
      coverLetter: `Interested in this role.`,
    };

    const app = await Application.create({
      userId,
      jobId,
      status: "READY",
      applicationPayload,
    });

    res.json({ success: true, applicationId: app._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
