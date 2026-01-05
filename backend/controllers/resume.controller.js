import parsePDF from "../utils/pdfParser.js"; // or .cjs
import model from "../config/gemini.js";
import CandidateProfile from "../models/CandidateProfile.js";
import User from "../models/User.js";
import fs from "fs";

const USE_MOCK_AI = false;

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.userId;
    let profileData;

    const text = await parsePDF(req.file.path);

    const prompt = `
    First, analyze the following text and determine if it is a Resume/CV.

    --------------------------------------------------------
    SCENARIO 1: NOT A RESUME
    --------------------------------------------------------
    If the text is clearly NOT a resume (e.g., a cooking recipe, homework, news article, lyrics, code block, or random text), output a JSON with this specific structure:
    {
        "name": "⚠️ Not a Resume",
        "email": "oops@wrongfile.com",
        "phone": "N/A",
        "location": "N/A",
        "atsScore": 0,
        "summary": "I analyzed this file and... well, it looks like [insert what it actually is, e.g., 'a pizza recipe' or 'math homework']. Unless you're applying to be a [insert funny job related to the file], please upload a real resume!",
        "missingKeywords": ["Actual Experience", "Resume Format", "Professionalism"],
        "improvements": ["Step 1: Find your actual resume.", "Step 2: Upload that instead.", "Step 3: Don't upload this file again."],
        "skills": ["Uploading Random Files", "Trolling AI"],
        "experience": [],
        "projects": [],
        "education": []
    }

    --------------------------------------------------------
    SCENARIO 2: IT IS A RESUME
    --------------------------------------------------------
    If it IS a resume, act as an ATS Scanner used by modern tech companies.
    
    While calculating the ATS score (0–100), internally evaluate:
    - Resume completeness and section coverage
    - Formatting safety for ATS systems (no tables, clarity, consistency)
    - Bullet point quality (action verbs, clarity, outcome-driven phrasing)
    - Presence of measurable impact (numbers, metrics, results)
    - Skill credibility (real-world usage vs buzzword stuffing)
    - Role seniority alignment (junior / mid / senior expectations inferred from resume)
    - Market relevance based on current industry standards

    Identify trending technical and domain-specific keywords that are commonly required
    for roles matching this resume’s domain and seniority level but are MISSING.

    Generate practical, highly specific improvements that directly increase ATS score
    and recruiter confidence (avoid generic advice).

    Do NOT add or remove fields. Do NOT change key names.
    Return valid JSON ONLY in the exact structure below:

    {
        "name": "Full Name",
        "email": "Email",
        "phone": "Phone",
        "location": "City, Country",
        "summary": "Professional Summary",
        "atsScore": 75,
        "missingKeywords": ["Docker", "Kubernetes", "CI/CD"],
        "improvements": [
            "Actionable, role-specific improvement 1",
            "Actionable, role-specific improvement 2"
        ],
        "experience": [
            {
                "title": "Job Title",
                "company": "Company",
                "duration": "Dates",
                "description": "Description"
            }
        ],
        "projects": [
            {
                "name": "Project Name",
                "description": "Desc",
                "technologies": ["Tech1"]
            }
        ],
        "education": [
            {
                "degree": "Degree",
                "school": "School",
                "year": "Year"
            }
        ],
        "skills": ["Skill1", "Skill2"]
    }

    Resume Text:
    ${text.substring(0, 8000)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "");

    try {
      profileData = JSON.parse(responseText);
    } catch (e) {
      profileData = {
        name: "Parsing Error",
        summary:
          "The AI couldn't parse this file. It might not be text-readable or the format is too complex.",
        atsScore: 0,
        skills: [],
      };
    }

    let profile = await CandidateProfile.findOne({ userId });
    if (profile) {
      profile = await CandidateProfile.findOneAndUpdate(
        { userId },
        profileData,
        { new: true }
      );
    } else {
      profile = await CandidateProfile.create({ userId, ...profileData });
    }

    if (
      profileData.skills &&
      Array.isArray(profileData.skills) &&
      profileData.skills.length > 0
    ) {
      await User.findByIdAndUpdate(userId, {
        skills: profileData.skills,
       
      });
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error(e);
      }
    }
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ msg: "No profile found" });
    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
