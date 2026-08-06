import Revision, { IRevision } from "../models/Revision";
import Project from "../models/Project";
import WebsiteSpecification from "../models/WebsiteSpecification";
import ApiError from "../utils/ApiError";

export const create = async (
  projectId: string,
  request: string
): Promise<IRevision> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const spec = await WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
  const version = spec ? spec.version : 1;

  const revision = await Revision.create({
    project: project._id,
    version,
    request,
  });

  project.revisions.push(revision._id);
  project.status = "revision";
  await project.save();

  return revision;
};

export const findByProject = async (projectId: string): Promise<IRevision[]> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Revision.find({ project: project._id }).sort({ createdAt: -1 });
};

export const findById = async (revisionId: string): Promise<IRevision | null> => {
  return Revision.findById(revisionId);
};

export const updateStatus = async (
  revisionId: string,
  status: "pending" | "applied" | "rejected"
): Promise<IRevision | null> => {
  return Revision.findByIdAndUpdate(revisionId, { status }, { new: true });
};

export const count = async (projectId: string): Promise<number> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Revision.countDocuments({ project: project._id });
};
