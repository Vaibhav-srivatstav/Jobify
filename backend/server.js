import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import resumeRoutes from './routes/resume.routes.js';
import analyzeRoutes from './routes/analyze.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/application', applicationRoutes);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));