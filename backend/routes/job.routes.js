import express from 'express';
import { getJobs, swipeRight, searchLinkedIn } from '../controllers/job.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/external-search', searchLinkedIn);
router.get('/feed', getJobs);
router.post('/swipe', swipeRight);

export default router;