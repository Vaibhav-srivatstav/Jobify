import express from 'express';
import multer from 'multer';
import { uploadResume, getProfile } from '../controllers/resume.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/profile', getProfile);
export default router;
