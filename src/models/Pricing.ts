import mongoose, { Schema, Document, Types } from "mongoose";
import { IBreakdownItem } from "../types";

export interface IPricing extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  basePrice: number;
  pageCharge: number;
  featureCharge: number;
  premiumComponentCharge: number;
  revisionCharge: number;
  total: number;
  breakdown: IBreakdownItem[];
  createdAt: Date;
  updatedAt: Date;
}

const breakdownItemSchema = new Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const pricingSchema = new Schema<IPricing>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    basePrice: { type: Number, required: true },
    pageCharge: { type: Number, required: true },
    featureCharge: { type: Number, required: true },
    premiumComponentCharge: { type: Number, required: true },
    revisionCharge: { type: Number, required: true },
    total: { type: Number, required: true },
    breakdown: [breakdownItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IPricing>("Pricing", pricingSchema);
