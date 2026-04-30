import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';

export interface IFeatureRequest extends Document {
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'under review' | 'implemented';
  votes: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
}

const FeatureRequestSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['pending', 'under review', 'implemented'], 
    default: 'pending' 
  },
  votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const FeatureRequest: Model<IFeatureRequest> = mongoose.models.FeatureRequest || mongoose.model<IFeatureRequest>('FeatureRequest', FeatureRequestSchema);
