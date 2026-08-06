import mongoose, { Schema, Document, Types } from "mongoose";
import { PaymentStatus } from "../types";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  pricing: Types.ObjectId;
  amount: number;
  method: string;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    pricing: { type: Schema.Types.ObjectId, ref: "Pricing", required: true },
    amount: { type: Number, required: true },
    method: { type: String, default: "mock_card" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
