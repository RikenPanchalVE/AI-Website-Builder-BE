import * as contactSubmissionRepo from "../repositories/contactSubmissionRepository";
import * as projectRepo from "../repositories/projectRepository";
import { IContactSubmission } from "../models/ContactSubmission";
import ApiError from "../utils/ApiError";

export const submitContactForm = async (data: {
  projectId?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}): Promise<IContactSubmission> => {
  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  // Best-effort project link - a submission from the live in-questionnaire
  // preview (no saved project context yet) or a stale/unknown id still gets
  // saved, just without a project reference, rather than being rejected.
  let projectObjectId;
  if (data.projectId) {
    const project = await projectRepo.findById(data.projectId);
    if (project) projectObjectId = project._id;
  }

  return contactSubmissionRepo.create({
    project: projectObjectId,
    name,
    email,
    subject: (data.subject || "").trim() || undefined,
    message,
  });
};

export const getSubmissions = async (projectId: string): Promise<IContactSubmission[]> => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  return contactSubmissionRepo.findByProject(project._id);
};
