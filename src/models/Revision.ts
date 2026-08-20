import mongoose, { Schema, Document, Types } from "mongoose";
import { RevisionStatus } from "../types";

// One leaf-level field that changed - path is the dotted config path (e.g.
// "theme.primaryColor"), label is a human-readable name for it (e.g.
// "Primary Color"). oldValue/newValue can be any JSON-serializable value:
// a string, a whole content array, a sectionColors preset object, etc. -
// see client/src/utils/configDiff.ts, which is what actually produces these.
export interface IRevisionChangeEntry {
  path: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface IRevision extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  version: number;
  // Auto-generated one-line summary (e.g. "3 changes: Primary Color, Hero
  // Section Style, Services") - kept for display/back-compat with anything
  // still reading `request` as a plain string. `changes` is the real,
  // structured record of what happened.
  request: string;
  status: RevisionStatus;
  changes: IRevisionChangeEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const revisionChangeEntrySchema = new Schema<IRevisionChangeEntry>(
  {
    path: { type: String, required: true },
    label: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const revisionSchema = new Schema<IRevision>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    version: { type: Number, required: true },
    request: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "applied", "rejected"],
      default: "applied",
    },
    changes: { type: [revisionChangeEntrySchema], default: [] },
  },
  { timestamps: true }
);

revisionSchema.index({ project: 1 });

export default mongoose.model<IRevision>("Revision", revisionSchema);
