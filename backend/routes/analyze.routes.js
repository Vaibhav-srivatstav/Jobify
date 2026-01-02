import express from 'express';
import { analyzeMatch } from '../controllers/analyze.controller.js';
import auth from '../middleware/auth.middleware.js'; // Import Auth

const router = express.Router();

router.post('/match', auth, analyzeMatch); 

export default router;