import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    salary: { type: String },
    description: { type: String, required: true },
    requiredSkills: [String], 
    applyUrl: String,
    postedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', JobSchema);