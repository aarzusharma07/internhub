import { Router } from 'express';
import Notification from '../models/Notification';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
const router = Router();
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.find({ userId: req.user?.id }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, notifications });
});
router.put('/:id/read', protect, async (req: AuthRequest, res: Response) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});
router.put('/read-all', protect, async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ userId: req.user?.id }, { isRead: true });
  res.json({ success: true });
});
export default router;
