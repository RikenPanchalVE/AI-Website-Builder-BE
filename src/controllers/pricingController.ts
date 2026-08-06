import { Request, Response, NextFunction } from "express";
import * as pricingService from "../services/pricingService";
import ApiResponse from "../utils/ApiResponse";

export const calculate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pricing = await pricingService.calculatePricing(req.params.projectId as string);
    ApiResponse.success(res, pricing, 201);
  } catch (err) { next(err); }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pricing = await pricingService.getPricing(req.params.projectId as string);
    ApiResponse.success(res, pricing);
  } catch (err) { next(err); }
};
