import * as revisionRepo from "../repositories/revisionRepository";
import { IRevision } from "../models/Revision";
import ApiError from "../utils/ApiError";

export const submitRevision = async (
  projectId: string,
  request: string
): Promise<IRevision> => {
  return revisionRepo.create(projectId, request);
};

export const getRevisions = async (projectId: string): Promise<IRevision[]> => {
  return revisionRepo.findByProject(projectId);
};

export const getRevisionCount = async (projectId: string): Promise<number> => {
  return revisionRepo.count(projectId);
};

export const updateRevisionStatus = async (
  revisionId: string,
  status: "pending" | "applied" | "rejected"
): Promise<IRevision> => {
  const revision = await revisionRepo.updateStatus(revisionId, status);
  if (!revision) throw new ApiError(404, "Revision not found");
  return revision;
};
