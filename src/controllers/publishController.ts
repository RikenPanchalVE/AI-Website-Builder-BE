import { Request, Response, NextFunction } from "express";
import * as publishService from "../services/publishService";
import ApiResponse from "../utils/ApiResponse";

export const publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const site = await publishService.publishSite(req.params.projectId as string);
    ApiResponse.success(res, site, 201);
  } catch (err) { next(err); }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const site = await publishService.getPublishedSite(req.params.projectId as string);
    ApiResponse.success(res, site);
  } catch (err) { next(err); }
};
