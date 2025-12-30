const pdfParse = require("pdf-parse");
const Resume = require("../models/resumemodel.js");

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const parsed = await pdfParse(req.file.buffer);

    const resume = await Resume.create({
      userId: "temp-user", // replace later with auth
      fileName: req.file.originalname,
      extractedText: parsed.text
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resumeId: resume._id
    });
  } catch (error) {
    next(error);
  }
};
