import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

export default router;