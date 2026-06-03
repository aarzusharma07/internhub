import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  stipend: number;
  duration: string;
  location: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  skillsRequired: string[];
  category: string;
  openings: number;
  deadline: Date;
  isActive: boolean;
  applicationsCount: number;
}

const InternshipSchema = new Schema<IInternship>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    stipend: { type: Number, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    locationType: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'onsite' },
    skillsRequired: [{ type: String }],
    category: { type: String, required: true },
    openings: { type: Number, default: 1 },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IInternship>('Internship', InternshipSchema);
