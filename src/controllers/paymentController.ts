import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/paymentService";
import ApiResponse from "../utils/ApiResponse";

export const process = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await paymentService.processPayment(req.params.projectId as string);
    ApiResponse.success(res, payment, 201);
  } catch (err) { next(err); }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await paymentService.getPayment(req.params.projectId as string);
    ApiResponse.success(res, payment);
  } catch (err) { next(err); }
};
