import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  phone?: string;
  college?: string;
  degree?: string;
  year?: string;
  skills: string[];
  bio?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  profileStrength: number;
  badges: string[];
  savedInternships: mongoose.Types.ObjectId[];
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String },
    college: { type: String },
    degree: { type: String },
    year: { type: String },
    skills: [{ type: String }],
    bio: { type: String },
    resumeUrl: { type: String },
    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    profileStrength: { type: Number, default: 20 },
    badges: [{ type: String }],
    savedInternships: [{ type: Schema.Types.ObjectId, ref: 'Internship' }],
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);
