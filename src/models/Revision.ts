import mongoose, { Schema, Document, Types } from "mongoose";
import { RevisionStatus } from "../types";

export interface IRevision extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  version: number;
  request: string;
  status: RevisionStatus;
  changes: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const revisionSchema = new Schema<IRevision>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    version: { type: Number, required: true },
    request: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "applied", "rejected"],
      default: "pending",
    },
    changes: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

revisionSchema.index({ project: 1 });

export default mongoose.model<IRevision>("Revision", revisionSchema);
