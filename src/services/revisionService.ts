import * as revisionRepo from "../repositories/revisionRepository";
import { IRevision, IRevisionChangeEntry } from "../models/Revision";
import ApiError from "../utils/ApiError";

// The actual edit already happened by the time this runs - the client
// calls saveQuestionnaire + generate (the same real pipeline that builds a
// project the first time, which genuinely applies whatever changed) before
// ever hitting this endpoint. There used to be a `processRevision` AI step
// here that tried to interpret a free-text request and patch the spec
// itself - it never did anything but glue a "Changes applied: <request
// text>" placeholder section onto the homepage, since there was no real
// parsing behind it. Revisions are now just a structured record of what a
// real edit changed, not a second (fake) mechanism for applying one.
function summarize(changes: IRevisionChangeEntry[]): string {
  if (changes.length === 0) return "No changes";
  const names = changes.slice(0, 3).map((c) => c.label);
  const rest = changes.length - names.length;
  return `${changes.length} change${changes.length === 1 ? "" : "s"}: ${names.join(", ")}${rest > 0 ? `, +${rest} more` : ""}`;
}

export const submitRevision = async (
  projectId: string,
  changes: IRevisionChangeEntry[]
): Promise<IRevision> => {
  return revisionRepo.create(projectId, summarize(changes), changes);
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
