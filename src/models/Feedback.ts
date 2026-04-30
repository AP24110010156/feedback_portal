import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  product: string;
  message: string;
  rating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  product: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
