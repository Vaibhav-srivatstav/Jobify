import express from 'express';
import { analyzeMatch, analyzeMatchWithFile } from '../controllers/analyze.controller.js';
import auth from '../middleware/auth.middleware.js'; // Import Auth
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/match', auth, analyzeMatch); 
router.post('/match-file', auth, upload.single('resume'), analyzeMatchWithFile);
export default router;