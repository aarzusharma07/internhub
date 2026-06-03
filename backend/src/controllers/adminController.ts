import { Response } from 'express';
import User from '../models/User';
import Company from '../models/Company';
import Internship from '../models/Internship';
import Application from '../models/Application';
import Student from '../models/Student';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalStudents, totalRecruiters, totalInternships, totalApplications, pendingCompanies] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'recruiter' }),
        Internship.countDocuments(),
        Application.countDocuments(),
        Company.countDocuments({ isApproved: false }),
      ]);
    res.json({ success: true, stats: { totalUsers, totalStudents, totalRecruiters, totalInternships, totalApplications, pendingCompanies } });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Student.findOneAndDelete({ userId: req.params.id });
    await Company.findOneAndDelete({ userId: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getPendingCompanies = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const companies = await Company.find({ isApproved: false }).populate('userId', 'name email status');
    res.json({ success: true, companies });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const approveCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).populate('userId');
    if (!company) { res.status(404).json({ success: false, message: 'Company not found' }); return; }
    const recruiterUser = company.userId as unknown as { _id: string };
    await User.findByIdAndUpdate(recruiterUser._id, { status: 'active' });
    await Notification.create({ userId: recruiterUser._id, title: 'Company Approved ✅', message: `${company.companyName} has been approved. You can now post internships!`, type: 'system' });
    res.json({ success: true, company });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applicationsByStatus = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const internshipsByCategory = await Internship.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    res.json({ success: true, analytics: { applicationsByStatus, internshipsByCategory, recentUsers } });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};
