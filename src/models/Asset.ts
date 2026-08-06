import mongoose, { Schema, Document, Types } from "mongoose";
import { AssetType } from "../types";

export interface IAsset extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  type: AssetType;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    type: {
      type: String,
      enum: ["logo", "image", "pdf", "docx", "txt"],
      required: true,
    },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
  },
  { timestamps: true }
);

assetSchema.index({ project: 1 });

export default mongoose.model<IAsset>("Asset", assetSchema);
