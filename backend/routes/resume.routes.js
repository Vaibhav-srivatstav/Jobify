import express from 'express';
import multer from 'multer';
import { uploadResume, getProfile, updateProfile } from '../controllers/resume.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('resume'), uploadResume);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
export default router;