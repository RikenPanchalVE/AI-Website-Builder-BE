import { Request, Response, NextFunction } from "express";
import * as questionnaireService from "../services/questionnaireService";
import ApiResponse from "../utils/ApiResponse";

export const saveQuestionnaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const questionnaire = await questionnaireService.saveQuestionnaire(
      req.params.projectId as string,
      req.body
    );
    ApiResponse.success(res, questionnaire, 201);
  } catch (err) {
    next(err);
  }
};

export const getQuestionnaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const questionnaire = await questionnaireService.getQuestionnaire(
      req.params.projectId as string
    );
    ApiResponse.success(res, questionnaire);
  } catch (err) {
    next(err);
  }
};

export const updateQuestionnaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const questionnaire = await questionnaireService.updateQuestionnaire(
      req.params.projectId as string,
      req.body
    );
    ApiResponse.success(res, questionnaire);
  } catch (err) {
    next(err);
  }
};
