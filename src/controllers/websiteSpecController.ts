import { Request, Response, NextFunction } from "express";
import * as websiteSpecService from "../services/websiteSpecService";
import ApiResponse from "../utils/ApiResponse";

export const generate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const spec = await websiteSpecService.generateWebsite(
      req.params.projectId as string
    );
    ApiResponse.success(res, spec, 201);
  } catch (err) {
    next(err);
  }
};

export const getLatest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const spec = await websiteSpecService.getLatestSpec(
      req.params.projectId as string
    );
    ApiResponse.success(res, spec);
  } catch (err) {
    next(err);
  }
};

export const getVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const version = parseInt(req.params.version as string, 10);
    const spec = await websiteSpecService.getSpecByVersion(
      req.params.projectId as string,
      version
    );
    ApiResponse.success(res, spec);
  } catch (err) {
    next(err);
  }
};

export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const spec = await websiteSpecService.approveSpec(
      req.params.projectId as string
    );
    ApiResponse.success(res, spec);
  } catch (err) {
    next(err);
  }
};
