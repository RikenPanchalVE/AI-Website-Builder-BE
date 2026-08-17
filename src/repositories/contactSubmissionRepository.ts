import ContactSubmission, { IContactSubmission } from "../models/ContactSubmission";
import { Types } from "mongoose";

export const create = async (data: {
  project?: Types.ObjectId;
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<IContactSubmission> => {
  return ContactSubmission.create(data);
};

export const findByProject = async (projectObjectId: Types.ObjectId): Promise<IContactSubmission[]> => {
  return ContactSubmission.find({ project: projectObjectId }).sort({ createdAt: -1 });
};
