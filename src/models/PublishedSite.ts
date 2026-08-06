import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPublishedSite extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  version: number;
  buildPath: string;
  url: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const publishedSiteSchema = new Schema<IPublishedSite>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    version: { type: Number, required: true },
    buildPath: { type: String, required: true },
    url: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPublishedSite>("PublishedSite", publishedSiteSchema);
