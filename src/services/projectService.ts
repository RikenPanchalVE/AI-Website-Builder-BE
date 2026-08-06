import * as projectRepo from "../repositories/projectRepository";
import ApiError from "../utils/ApiError";
import { IProject, IEnquiry, ProjectStatus } from "../types";

const VALID_STATUSES: ProjectStatus[] = [
  "created", "questionnaire_complete", "assets_uploaded",
  "generating", "generated", "revision", "approved",
  "priced", "paid", "published",
];

export const createProject = async (enquiry: IEnquiry): Promise<IProject> => {
  const project = await projectRepo.create({
    name: enquiry.businessName,
    enquiry,
  });
  return project as IProject;
};

export const getProject = async (projectId: string): Promise<IProject> => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

export const updateProjectStatus = async (
  projectId: string,
  status: string
): Promise<IProject> => {
  if (!VALID_STATUSES.includes(status as ProjectStatus)) {
    throw new ApiError(400, `Invalid status: ${status}`);
  }
  const project = await projectRepo.updateStatus(projectId, status);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};

export const updateProject = async (
  projectId: string,
  data: Partial<IProject>
): Promise<IProject> => {
  const project = await projectRepo.update(projectId, data);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
};
