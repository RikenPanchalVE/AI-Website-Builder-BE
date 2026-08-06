import mongoose, { Schema, Document, Types } from "mongoose";
import { ISection, IPage } from "../types";

export interface IWebsiteSpecification extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  version: number;
  name: string;
  description: string;
  pages: IPage[];
  theme: Record<string, any>;
  navigation: Record<string, any>;
  footer: Record<string, any>;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    component: { type: String, required: true },
    props: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const pageSchema = new Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    sections: [sectionSchema],
  },
  { _id: false }
);

const websiteSpecificationSchema = new Schema<IWebsiteSpecification>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    version: { type: Number, default: 1 },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    pages: [pageSchema],
    theme: { type: Schema.Types.Mixed, default: {} },
    navigation: { type: Schema.Types.Mixed, default: {} },
    footer: { type: Schema.Types.Mixed, default: {} },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

websiteSpecificationSchema.index({ project: 1, version: 1 });

export default mongoose.model<IWebsiteSpecification>(
  "WebsiteSpecification",
  websiteSpecificationSchema
);
