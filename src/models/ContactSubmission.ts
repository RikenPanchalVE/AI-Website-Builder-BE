import mongoose, { Schema, Document, Types } from "mongoose";

// Leads captured from a generated site's Contact form. `project` is
// optional rather than required — the same Contact1/Contact2 components
// render inside the in-questionnaire live preview (before a project has a
// resolvable id in this collection's sense) and inside downloaded/exported
// sites (which never reach this collection at all, see downloadService's
// standalone /api/contact route) — a submission that can't be linked to a
// project is still worth keeping rather than rejecting outright.
export interface IContactSubmission extends Document {
  _id: Types.ObjectId;
  project?: Types.ObjectId;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IContactSubmission>("ContactSubmission", contactSubmissionSchema);
