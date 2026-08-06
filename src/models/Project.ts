import mongoose, { Schema, Document, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ProjectStatus, IEnquiry } from "../types";

export interface IProject extends Document {
  _id: Types.ObjectId;
  projectId: string;
  name: string;
  status: ProjectStatus;
  enquiry?: IEnquiry;
  questionnaire?: Types.ObjectId;
  assets: Types.ObjectId[];
  websiteSpec?: Types.ObjectId;
  theme?: Types.ObjectId;
  revisions: Types.ObjectId[];
  pricing?: Types.ObjectId;
  payment?: Types.ObjectId;
  publishedSite?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    projectId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "Untitled Project",
    },
    status: {
      type: String,
      enum: [
        "created",
        "questionnaire_complete",
        "assets_uploaded",
        "generating",
        "generated",
        "revision",
        "approved",
        "priced",
        "paid",
        "published",
      ],
      default: "created",
    },
    enquiry: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      businessName: { type: String },
      businessType: { type: String },
    },
    questionnaire: {
      type: Schema.Types.ObjectId,
      ref: "Questionnaire",
    },
    assets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Asset",
      },
    ],
    websiteSpec: {
      type: Schema.Types.ObjectId,
      ref: "WebsiteSpecification",
    },
    theme: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
    },
    revisions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Revision",
      },
    ],
    pricing: {
      type: Schema.Types.ObjectId,
      ref: "Pricing",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    publishedSite: {
      type: Schema.Types.ObjectId,
      ref: "PublishedSite",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
