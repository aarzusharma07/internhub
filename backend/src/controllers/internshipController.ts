import { Request, Response } from 'express';
import Internship from '../models/Internship';
import Company from '../models/Company';
import { AuthRequest } from '../middleware/auth';

export const getInternships = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, skill, location, locationType, minStipend, maxStipend, duration, category, page = 1, limit = 12 } = req.query;
    const query: Record<string, unknown> = { isActive: true };

    if (search) query.title = { $regex: search, $options: 'i' };
    if (skill) query.skillsRequired = { $in: [new RegExp(String(skill), 'i')] };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (locationType) query.locationType = locationType;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (duration) query.duration = { $regex: duration, $options: 'i' };
    if (minStipend || maxStipend) {
      query.stipend = {};
      if (minStipend) (query.stipend as Record<string, unknown>)['$gte'] = Number(minStipend);
      if (maxStipend) (query.stipend as Record<string, unknown>)['$lte'] = Number(maxStipend);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Internship.countDocuments(query);
    const internships = await Internship.find(query)
      .populate('companyId', 'companyName logo industry location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, internships, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const getInternshipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const internship = await Internship.findById(req.params.id).populate('companyId');
    if (!internship) { res.status(404).json({ success: false, message: 'Internship not found' }); return; }
    res.json({ success: true, internship });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const createInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findOne({ userId: req.user?.id });
    if (!company) { res.status(403).json({ success: false, message: 'Company profile not found' }); return; }
    if (!company.isApproved) { res.status(403).json({ success: false, message: 'Company not approved yet' }); return; }
    const internship = await Internship.create({ ...req.body, companyId: company._id });
    res.status(201).json({ success: true, internship });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const updateInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findOne({ userId: req.user?.id });
    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, companyId: company?._id },
      req.body, { new: true }
    );
    if (!internship) { res.status(404).json({ success: false, message: 'Internship not found or unauthorized' }); return; }
    res.json({ success: true, internship });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};

export const deleteInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const company = await Company.findOne({ userId: req.user?.id });
    const internship = await Internship.findOneAndDelete({ _id: req.params.id, companyId: company?._id });
    if (!internship) { res.status(404).json({ success: false, message: 'Not found or unauthorized' }); return; }
    res.json({ success: true, message: 'Internship deleted' });
  } catch (err: unknown) { res.status(500).json({ success: false, message: (err as Error).message }); }
};
