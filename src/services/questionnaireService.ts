import * as questionnaireRepo from "../repositories/questionnaireRepository";
import * as projectRepo from "../repositories/projectRepository";
import { IQuestionnaireDoc } from "../models/Questionnaire";
import { IQuestionnaire } from "../types";

export const saveQuestionnaire = async (
  projectId: string,
  data: Record<string, any>
): Promise<IQuestionnaireDoc> => {
  const project = await projectRepo.findById(projectId);
  if (!project?.enquiry) {
    throw new Error("Project enquiry data not found");
  }

  const incoming = data.answers || data;

  // Support both old flat format and new nested WebsiteConfig format
  const businessType = incoming.business?.type || incoming.industry || project.enquiry.businessType || "";
  const businessName = incoming.business?.name || incoming.businessName || project.enquiry.businessName || "";

  // Flatten the new WebsiteConfig into the answers format expected by MockAIProvider
  const mergedAnswers: Record<string, any> = {
    ...incoming,
    businessName,
    industry: businessType,
    businessDescription: incoming.business?.description || incoming.businessDescription || "",
    targetAudience: incoming.business?.targetAudience || incoming.targetAudience || "",
    logo: incoming.branding?.logo || incoming.logo || null,
    themeStyle: incoming.theme?.style || incoming.themeStyle || "",
    primaryColor: incoming.theme?.primaryColor || incoming.primaryColor || "",
    secondaryColor: incoming.theme?.secondaryColor || incoming.secondaryColor || "",
    fontStyle: incoming.theme?.typography || incoming.fontStyle || "",
    pages: incoming.pages || [],
    homepageSections: incoming.sections?.home || Object.values(incoming.sections || {}).flat() as string[],
    pageSections: incoming.sections || {},
    features: incoming.goals || [],
    selectedPages: incoming.pages || [],
    // Pass through content items
    services: incoming.content?.services || [],
    testimonials: incoming.content?.testimonials || [],
    faq: incoming.content?.faq || [],
    // Component selections
    componentSelections: incoming.components || {},
  };

  const existing = await questionnaireRepo.findByProject(projectId);
  if (existing) {
    return questionnaireRepo.update(projectId, { answers: mergedAnswers }) as Promise<IQuestionnaireDoc>;
  }
  return questionnaireRepo.create(projectId, { answers: mergedAnswers });
};

export const getQuestionnaire = async (
  projectId: string
): Promise<IQuestionnaireDoc | null> => {
  return questionnaireRepo.findByProject(projectId);
};

export const updateQuestionnaire = async (
  projectId: string,
  data: Partial<IQuestionnaire>
): Promise<IQuestionnaireDoc | null> => {
  return questionnaireRepo.update(projectId, data);
};
