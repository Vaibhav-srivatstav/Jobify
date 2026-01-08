import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'; // <--- NEW
import resumeRoutes from './routes/resume.routes.js';
import analyzeRoutes from './routes/analyze.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import profileRoutes from './routes/profile.routes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: [
    'https://jobify-nu-ecru.vercel.app'
    'http://localhost:3000',
  ],
  
  credentials: true 
}));

// Middleware
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
