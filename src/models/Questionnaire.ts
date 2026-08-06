import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestionnaireDoc extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  answers: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const questionnaireSchema = new Schema<IQuestionnaireDoc>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    answers: { type: Schema.Types.Mixed, default: {} },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionnaireDoc>("Questionnaire", questionnaireSchema);
