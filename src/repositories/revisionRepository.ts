import Revision, { IRevision, IRevisionChangeEntry } from "../models/Revision";
import Project from "../models/Project";
import WebsiteSpecification from "../models/WebsiteSpecification";
import ApiError from "../utils/ApiError";

export const create = async (
  projectId: string,
  request: string,
  changes: IRevisionChangeEntry[]
): Promise<IRevision> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  // The real edit (saveQuestionnaire + generate) already ran by the time
  // this is called, so "latest spec version" here IS the version these
  // changes produced - not a stale pre-edit number.
  const spec = await WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
  const version = spec ? spec.version : 1;

  const revision = await Revision.create({
    project: project._id,
    version,
    request,
    status: "applied",
    changes,
  });

  project.revisions.push(revision._id);
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
