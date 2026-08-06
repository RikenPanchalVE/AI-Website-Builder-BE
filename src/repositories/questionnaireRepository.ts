import Questionnaire, { IQuestionnaireDoc } from "../models/Questionnaire";
import Project from "../models/Project";
import ApiError from "../utils/ApiError";
import { IQuestionnaire } from "../types";

export const create = async (
  projectId: string,
  data: IQuestionnaire
): Promise<IQuestionnaireDoc> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const questionnaire = await Questionnaire.create({
    project: project._id,
    ...data,
    completedAt: new Date(),
  });

  project.questionnaire = questionnaire._id;
  project.status = "questionnaire_complete";
  await project.save();

  return questionnaire;
};

export const findByProject = async (
  projectId: string
): Promise<IQuestionnaireDoc | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Questionnaire.findOne({ project: project._id });
};

export const update = async (
  projectId: string,
  data: Partial<IQuestionnaire>
): Promise<IQuestionnaireDoc | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Questionnaire.findOneAndUpdate(
    { project: project._id },
    { $set: data },
    { new: true }
  );
};
