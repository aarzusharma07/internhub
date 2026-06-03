import { Router } from 'express';
import { getStudentProfile, updateStudentProfile, getMyApplications } from '../controllers/studentController';
import { protect, authorize } from '../middleware/auth';
const router = Router();
router.use(protect, authorize('student'));
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/applications', getMyApplications);
export default router;
