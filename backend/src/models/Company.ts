import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  industry: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
  size?: string;
  isApproved: boolean;
}

const CompanySchema = new Schema<ICompany>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    logo: { type: String },
    location: { type: String },
    size: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);
