import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offered'
  | 'rejected'
  | 'completed';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  internshipId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  appliedDate: Date;
  interviewDate?: Date;
  interviewLink?: string;
  coverLetter?: string;
  recruiterNotes?: string;
  recruiterScore?: number;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    internshipId: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'rejected', 'completed'],
      default: 'applied',
    },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    interviewLink: { type: String },
    coverLetter: { type: String },
    recruiterNotes: { type: String },
    recruiterScore: { type: Number, min: 0, max: 10 },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
