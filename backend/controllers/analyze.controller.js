import model from '../config/gemini.js';
import CandidateProfile from '../models/CandidateProfile.js';
import parsePDF from '../utils/pdfParser.js'; 
import fs from 'fs';

const cleanAIResponse = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeMatch = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ msg: "Please provide a Job Description" });
        }

        const profile = await CandidateProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ msg: "Resume not found in profile. Please upload one or attach a file." });
        }

        const prompt = `
        Act as a strict Technical Recruiter. Compare the following Candidate Profile against the Job Description.

        CANDIDATE PROFILE:
        - Skills: ${profile.skills.join(', ')}
        - Experience: ${JSON.stringify(profile.experience)}
        - Projects: ${JSON.stringify(profile.projects)}

        JOB DESCRIPTION:
        ${jobDescription.substring(0, 5000)}

        ---------------------------------------------------
        ANALYSIS INSTRUCTIONS:
        1. Calculate a "Match Score" (0-100) based on skills, experience years, and project relevance. Be realistic, not generous.
        2. Identify "Missing Keywords" (Critical skills mentioned in JD but absent in Profile).
        3. Write a "Verdict": A 2-sentence summary of whether they should apply or not.

        OUTPUT JSON ONLY:
        {
            "matchScore": 75,
            "missingKeywords": ["React Native", "GraphQL"],
            "verdict": "Strong candidate for frontend, but lacks required mobile experience.",
            "explanation": "Candidate has excellent React skills which match 80% of the requirements..."
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = cleanAIResponse(result.response.text());
        
        try {
            const analysis = JSON.parse(responseText);
            return res.json(analysis);
        } catch (e) {
            console.error("JSON Parse Error:", responseText);
            return res.status(500).json({ msg: "AI returned invalid JSON format" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};


export const analyzeMatchWithFile = async (req, res) => {
    let filePath = req.file ? req.file.path : null;

    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            if (filePath) fs.unlinkSync(filePath);
            return res.status(400).json({ msg: "Please provide a Job Description" });
        }
        if (!filePath) {
            return res.status(400).json({ msg: "No resume file uploaded" });
        }

        const resumeText = await parsePDF(filePath);

        const prompt = `
        Act as a strict Technical Recruiter. Compare the following Candidate Profile against the Job Description.

        CANDIDATE PROFILE:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription.substring(0, 5000)}

        ---------------------------------------------------
        ANALYSIS INSTRUCTIONS:
        1. Calculate a "Match Score" (0-100) based on skills, experience years, and project relevance. Be realistic, not generous.
        2. Identify "Missing Keywords" (Critical skills mentioned in JD but absent in Profile).
        3. Write a "Verdict": A 2-sentence summary of whether they should apply or not.

        OUTPUT JSON ONLY:
        {
            "matchScore": 75,
            "missingKeywords": ["React Native", "GraphQL"],
            "verdict": "Strong candidate for frontend, but lacks required mobile experience.",
            "explanation": "Candidate has excellent React skills which match 80% of the requirements..."
        }
        `;

        
        const result = await model.generateContent(prompt);
        const responseText = cleanAIResponse(result.response.text());
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        try {
            const analysis = JSON.parse(responseText);
            res.json(analysis);
        } catch (e) {
            console.error("JSON Parse Error:", responseText);
            res.status(500).json({ msg: "AI response format error" });
        }

    } catch (err) {
        console.error("Analysis Error:", err);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ msg: 'Server Error during file analysis' });
    }
};