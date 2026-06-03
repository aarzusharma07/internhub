import { Router } from 'express';
import { applyToInternship, getRecruiterApplicants, updateApplicationStatus } from '../controllers/applicationController';
import { protect, authorize } from '../middleware/auth';
const router = Router();
router.post('/', protect, authorize('student'), applyToInternship);
router.get('/', protect, authorize('recruiter', 'admin'), getRecruiterApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
export default router;
