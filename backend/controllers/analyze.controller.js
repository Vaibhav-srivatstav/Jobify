import model from '../config/gemini.js';
import CandidateProfile from '../models/CandidateProfile.js';

export const analyzeMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ msg: "Please provide a Job Description" });
        }

        // 1. Fetch the user's parsed profile
        const profile = await CandidateProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ msg: "Resume not found. Please upload a resume first." });
        }

        // 2. Construct the Gemini Prompt
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

        // 3. Ask Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '');
        
        let analysis;
        try {
            analysis = JSON.parse(responseText);
        } catch (e) {
            analysis = { 
                matchScore: 0, 
                verdict: "Error analyzing match.", 
                explanation: "AI could not process the request." 
            };
        }

        res.json(analysis);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};