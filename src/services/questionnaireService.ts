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
  const mergedAnswers: Record<string, any> = {
    ...incoming,
    businessName: incoming.businessName || project.enquiry.businessName || "",
    industry: incoming.industry || project.enquiry.businessType || "",
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
