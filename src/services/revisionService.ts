import * as revisionRepo from "../repositories/revisionRepository";
import * as websiteSpecRepo from "../repositories/websiteSpecRepository";
import { IRevision } from "../models/Revision";
import ApiError from "../utils/ApiError";
import createAIProvider from "./ai";

export const submitRevision = async (
  projectId: string,
  request: string
): Promise<IRevision> => {
  const revision = await revisionRepo.create(projectId, request);
  const latestSpec = await websiteSpecRepo.findLatest(projectId);

  if (latestSpec) {
    const ai = createAIProvider();
    const updatedSpec = await ai.processRevision(
      latestSpec.toObject() as Record<string, unknown>,
      request
    );

    await websiteSpecRepo.create(
      projectId,
      {
        name: updatedSpec.name as string | undefined,
        description: updatedSpec.description as string | undefined,
        pages: updatedSpec.pages as any,
        theme: updatedSpec.theme as Record<string, any> | undefined,
        navigation: updatedSpec.navigation as Record<string, any> | undefined,
        footer: updatedSpec.footer as Record<string, any> | undefined,
      },
      latestSpec.version + 1
    );
  }

  return revision;
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
