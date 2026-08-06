import WebsiteSpecification, { IWebsiteSpecification } from "../models/WebsiteSpecification";
import Project from "../models/Project";
import ApiError from "../utils/ApiError";
import { IPage } from "../types";

interface SpecData {
  name?: string;
  description?: string;
  pages: IPage[];
  theme?: Record<string, any>;
  navigation?: Record<string, any>;
  footer?: Record<string, any>;
}

export const create = async (
  projectId: string,
  data: SpecData,
  version: number = 1
): Promise<IWebsiteSpecification> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const spec = await WebsiteSpecification.create({
    project: project._id,
    version,
    name: data.name || "",
    description: data.description || "",
    pages: data.pages,
    theme: data.theme || {},
    navigation: data.navigation || {},
    footer: data.footer || {},
  });

  project.websiteSpec = spec._id;
  project.status = "generated";
  await project.save();

  return spec;
};

export const findByProject = async (projectId: string): Promise<IWebsiteSpecification | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
};

export const findByProjectAndVersion = async (
  projectId: string,
  version: number
): Promise<IWebsiteSpecification | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return WebsiteSpecification.findOne({ project: project._id, version });
};

export const findLatest = async (projectId: string): Promise<IWebsiteSpecification | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
};

export const lock = async (projectId: string): Promise<IWebsiteSpecification | null> => {
  const spec = await findLatest(projectId);
  if (!spec) throw new ApiError(404, "Website spec not found");
  spec.isLocked = true;
  return spec.save();
};
