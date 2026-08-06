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
    assets.map((a) => a.toObject() as Record<string, unknown>)
  );

  const pages = (specData.pages as any[]) || [];
  const spec = await websiteSpecRepo.create(projectId, {
    name: specData.name as string || "",
    description: specData.description as string || "",
    pages,
    theme: specData.theme as Record<string, any> || {},
    navigation: specData.navigation as Record<string, any> || {},
    footer: specData.footer as Record<string, any> || {},
  });

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
