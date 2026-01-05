import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CandidateProfile from '../models/CandidateProfile.js';
import linkedinPkg from 'linkedin-jobs-api';

// --- CONSTANTS: SKILL EXTRACTION LIST ---
const SKILL_KEYWORDS = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "NestJS",
    "Python", "Django", "Flask", "FastAPI", "Java", "Spring Boot", "C++", "C#", ".NET",
    "Go", "Rust", "PHP", "Laravel", "Ruby", "Rails", "Swift", "Kotlin", "Flutter", "React Native",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Prisma", "Mongoose",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "CI/CD", "DevOps",
    "Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum",
    "HTML", "CSS", "Tailwind", "Sass", "Material UI", "Bootstrap", "Redux", "GraphQL", "REST API",
    "Machine Learning", "AI", "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch"
];

// --- HELPER FUNCTIONS ---

const extractSkills = (text) => {
    if (!text) return [];
    const lowerText = text.toLowerCase();
    // Return unique skills found in text
    return [...new Set(SKILL_KEYWORDS.filter(skill => 
        lowerText.includes(skill.toLowerCase())
    ))];
};

function capitalize(str) {
    if(!str) return "Full-time";
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export const searchLinkedIn = async (req, res) => {
    const { keyword, location, jobType, remoteFilter, experienceLevel } = req.body;
    

    try {
        const linkedin = linkedinPkg.default || linkedinPkg;
        
        // 1. Dynamic Query Options
        const queryOptions = {
            keyword: keyword || "Software Engineer",
            location: location || "India",
            dateSincePosted: "past Week",
            jobType: jobType === "all" ? "" : (jobType || "full time"),
            remoteFilter: remoteFilter === "all" ? "" : (remoteFilter || "remote"),
            experienceLevel: experienceLevel || "entry level", 
            limit: "25",
            page: "0"
        };

        let response = [];
        try {
            response = await linkedin.query(queryOptions);
        } catch (e) {
            console.log("⚠️ LinkedIn API failed. Switching to Backup Mode.");
        }

        // 2. PROCESS LIVE DATA (If API worked)
        if (response && response.length > 0) {
            console.log(`✅ SUCCESS: Found ${response.length} jobs.`);
            
            const formattedJobs = response.map((job, index) => {
                // 🔥 REAL SKILL EXTRACTION HERE
                const fullText = (job.position + " " + job.description).toLowerCase();
                let extracted = extractSkills(fullText);

                // Fallback: If no skills found, use the search keyword
                if (extracted.length === 0 && keyword) extracted.push(keyword);

                return {
                    _id: "ext_" + Date.now() + "_" + index,
                    title: job.position,
                    company: job.company,
                    location: job.location,
                    type: jobType && jobType !== "all" ? capitalize(jobType) : "Full-time", 
                    salary: job.salary || "Not Disclosed",
                    description: "Check LinkedIn for full details...",
                    applyUrl: job.jobUrl,
                    requiredSkills: extracted, // Sending real skills to frontend
                    postedAt: new Date(),
                    source: "LinkedIn"
                };
            });

            return res.json({ success: true, count: formattedJobs.length, jobs: formattedJobs });
        }

        // 3. BACKUP DATA (If API failed)
        console.log("⚠️ No live data. Returning General Backup Data.");
        
        const backupRoles = [
            { title: "Frontend Developer", skill: "React" },
            { title: "Backend Engineer", skill: "Node.js" },
            { title: "Full Stack Developer", skill: "MERN Stack" },
            { title: "DevOps Engineer", skill: "AWS" },
            { title: "Data Analyst", skill: "Python" }
        ];

        const backupJobs = backupRoles.map((role, i) => ({
            _id: "backup_" + i,
            title: role.title,
            company: ["Tech Corp", "StartUp Inc", "Innovate Ltd"][i % 3],
            location: location || "Remote",
            type: jobType !== "all" ? capitalize(jobType) : "Full-time",
            salary: "Not Disclosed",
            description: `We are hiring a ${role.title}. Click to apply on our careers page.`,
            applyUrl: "https://www.linkedin.com/jobs",
            requiredSkills: [role.skill, keyword || "Tech"], 
            postedAt: new Date(),
            source: "LinkedIn (Backup)"
        }));

        return res.json({ 
            success: true, 
            count: backupJobs.length, 
            jobs: backupJobs,
            msg: "Showing backup results (LinkedIn blocked the live request)" 
        });

    } catch (err) {
        console.error("❌ CRITICAL ERROR:", err);
        res.status(500).json({ success: false, msg: "Server Error", error: err.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 }).limit(20);
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const swipeRight = async (req, res) => {
     try {
        const { jobId } = req.body;
        const userId = req.userId;
        
        // Block swiping on external LinkedIn jobs
        if (jobId.toString().startsWith("ext_") || jobId.toString().startsWith("backup_")) {
            return res.status(400).json({ msg: "Cannot swipe on external jobs. Please apply on LinkedIn." });
        }

        const profile = await CandidateProfile.findOne({ userId });
        if (!profile) return res.status(404).json({ msg: "Profile not found" });
        
        const applicationPayload = {
            fullName: profile.name,
            email: profile.email,
            coverLetter: `Interested in this role.`
        };

        const app = await Application.create({
            userId,
            jobId,
            status: 'READY',
            applicationPayload
        });

        res.json({ success: true, applicationId: app._id });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};