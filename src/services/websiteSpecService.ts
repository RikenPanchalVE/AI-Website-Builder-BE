import * as websiteSpecRepo from "../repositories/websiteSpecRepository";
import * as questionnaireRepo from "../repositories/questionnaireRepository";
import * as assetRepo from "../repositories/assetRepository";
import createAIProvider from "./ai";
import { IWebsiteSpecification } from "../models/WebsiteSpecification";
import ApiError from "../utils/ApiError";

export const generateWebsite = async (projectId: string): Promise<IWebsiteSpecification> => {
  const questionnaire = await questionnaireRepo.findByProject(projectId);
  if (!questionnaire) throw new ApiError(400, "Complete questionnaire first");

  const assets = await assetRepo.findByProject(projectId);

  const ai = createAIProvider();
  const specData = await ai.generateWebsiteSpec(
    questionnaire.toObject() as Record<string, unknown>,
    assets.map((a) => a.toObject() as Record<string, unknown>),
    projectId
  );

  // create() defaults to version 1 when not given one explicitly, and this
  // call never passed one - so every single regenerate (including every
  // "Save Changes" edit) created ANOTHER version-1 document instead of
  // incrementing, and findLatest's `sort({version: -1})` has no secondary
  // tiebreaker for same-version documents, making "the latest spec" an
  // unreliable pick once more than one existed. Explicitly incrementing
  // from whatever the current latest version is fixes both: the spec
  // history is now actually ordered, and Revision History's version
  // numbers mean something.
  const previous = await websiteSpecRepo.findLatest(projectId);
  const nextVersion = (previous?.version || 0) + 1;

  const pages = (specData.pages as any[]) || [];
  const spec = await websiteSpecRepo.create(
    projectId,
    {
      name: specData.name as string || "",
      description: specData.description as string || "",
      logo: specData.logo as string || null,
      seo: specData.seo as Record<string, any> || {},
      pages,
      theme: specData.theme as Record<string, any> || {},
      navigation: specData.navigation as Record<string, any> || {},
      footer: specData.footer as Record<string, any> || {},
    },
    nextVersion
  );

  return spec;
};

export const getLatestSpec = async (projectId: string): Promise<IWebsiteSpecification | null> => {
  return websiteSpecRepo.findLatest(projectId);
};

export const getSpecByVersion = async (
  projectId: string,
  version: number
): Promise<IWebsiteSpecification | null> => {
  return websiteSpecRepo.findByProjectAndVersion(projectId, version);
};

export const approveSpec = async (projectId: string): Promise<IWebsiteSpecification> => {
  return websiteSpecRepo.lock(projectId) as Promise<IWebsiteSpecification>;
};
