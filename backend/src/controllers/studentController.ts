import { Response } from 'express';
import Student from '../models/Student';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth';

export const getStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findOne({ userId: req.user?.id }).populate('userId', 'name email avatar');
    if (!student) { res.status(404).json({ success: false, message: 'Profile not found' }); return; }
    res.json({ success: true, student });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    // Calculate profile strength
    const fields = ['phone', 'college', 'degree', 'year', 'bio', 'resumeUrl', 'linkedinUrl', 'githubUrl'];
    const filled = fields.filter(f => updates[f] || req.body[f]).length;
    const skillBonus = (updates.skills?.length || 0) > 2 ? 10 : 0;
    updates.profileStrength = Math.min(100, 20 + filled * 9 + skillBonus);

    // Award badges
    const badges: string[] = [];
    if (updates.resumeUrl) badges.push('Resume Ready');
    if ((updates.skills?.length || 0) >= 3) badges.push('Skilled');
    if (updates.linkedinUrl) badges.push('LinkedIn Connected');
    if (updates.college) badges.push('Verified Student');
    updates.badges = badges;

    const student = await Student.findOneAndUpdate({ userId: req.user?.id }, updates, { new: true, runValidators: true });
    res.json({ success: true, student });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findOne({ userId: req.user?.id });
    if (!student) { res.status(404).json({ success: false, message: 'Profile not found' }); return; }
    const applications = await Application.find({ studentId: student._id })
      .populate({ path: 'internshipId', populate: { path: 'companyId', select: 'companyName logo industry' } })
      .sort({ appliedDate: -1 });
    res.json({ success: true, applications });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};
