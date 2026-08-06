import mongoose, { Schema, Document, Types } from "mongoose";
import { BorderRadius, Spacing, ButtonStyle } from "../types";

export interface ITheme extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  primaryColor: string;
  secondaryColor: string;
  typography: string;
  borderRadius: BorderRadius;
  spacing: Spacing;
  buttonStyle: ButtonStyle;
  darkMode: boolean;
  animations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema<ITheme>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    primaryColor: { type: String, default: "#2563EB" },
    secondaryColor: { type: String, default: "#1E40AF" },
    typography: { type: String, default: "Inter" },
    borderRadius: { type: String, enum: ["none", "small", "medium", "large"], default: "medium" },
    spacing: { type: String, enum: ["compact", "normal", "relaxed"], default: "normal" },
    buttonStyle: { type: String, enum: ["rounded", "square", "pill"], default: "rounded" },
    darkMode: { type: Boolean, default: false },
    animations: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITheme>("Theme", themeSchema);
