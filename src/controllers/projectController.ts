import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService";
import ApiResponse from "../utils/ApiResponse";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.createProject(req.body);
    ApiResponse.success(res, project, 201);
  } catch (err) {
    next(err);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProject(req.params.projectId as string);
    ApiResponse.success(res, project);
  } catch (err) {
    next(err);
  }
};

export const updateProjectStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body as { status: string };
    const project = await projectService.updateProjectStatus(
      req.params.projectId as string,
      status
    );
    ApiResponse.success(res, project);
  } catch (err) {
    next(err);
  }
};
