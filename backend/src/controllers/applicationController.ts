import { Response } from 'express';
import Application from '../models/Application';
import Internship from '../models/Internship';
import Student from '../models/Student';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const applyToInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findOne({ userId: req.user?.id });
    if (!student) { res.status(404).json({ success: false, message: 'Student profile not found' }); return; }
    const { internshipId, coverLetter } = req.body;
    const existing = await Application.findOne({ studentId: student._id, internshipId });
    if (existing) { res.status(400).json({ success: false, message: 'Already applied' }); return; }
    const application = await Application.create({ studentId: student._id, internshipId, coverLetter });
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicationsCount: 1 } });
    // notify
    await Notification.create({ userId: req.user?.id, title: 'Application Submitted', message: 'Your application was submitted successfully!', type: 'application' });
    // First application badge
    const count = await Application.countDocuments({ studentId: student._id });
    if (count === 1) await Student.findByIdAndUpdate(student._id, { $addToSet: { badges: 'First Applicant 🚀' } });
    res.status(201).json({ success: true, application });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getRecruiterApplicants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { internshipId, status } = req.query;
    const query: Record<string, unknown> = {};
    if (internshipId) query.internshipId = internshipId;
    if (status) query.status = status;
    const applications = await Application.find(query)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('internshipId', 'title')
      .sort({ appliedDate: -1 });
    res.json({ success: true, applications });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, recruiterNotes, recruiterScore, interviewDate, interviewLink } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, recruiterNotes, recruiterScore, interviewDate, interviewLink },
      { new: true }
    ).populate('studentId');

    if (!application) { res.status(404).json({ success: false, message: 'Application not found' }); return; }

    // Send notification to student
    const student = application.studentId as unknown as { userId: string };
    const notifMap: Record<string, { title: string; type: string }> = {
      shortlisted: { title: 'You have been Shortlisted! 🎉', type: 'shortlist' },
      rejected: { title: 'Application Update', type: 'rejection' },
      interview_scheduled: { title: 'Interview Scheduled 📅', type: 'interview' },
      offered: { title: 'Offer Released! 🏆', type: 'offer' },
    };
    const notif = notifMap[status];
    if (notif) {
      await Notification.create({ userId: student.userId, title: notif.title, message: `Status: ${status.replace('_', ' ')}`, type: notif.type });
    }
    res.json({ success: true, application });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};
