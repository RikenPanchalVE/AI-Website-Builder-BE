import { Request, Response, NextFunction } from "express";
import * as websiteSpecService from "../services/websiteSpecService";
import * as revisionRepo from "../repositories/revisionRepository";
import * as pricingRepo from "../repositories/pricingRepository";
import * as paymentRepo from "../repositories/paymentRepository";
import * as publishedSiteRepo from "../repositories/publishedSiteRepository";
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

export const getRevisions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const revisions = await revisionRepo.findByProject(
      req.params.projectId as string
    );
    ApiResponse.success(res, revisions);
  } catch (err) {
    next(err);
  }
};

export const createRevision = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const revision = await revisionRepo.create(
      req.params.projectId as string,
      req.body.request
    );
    ApiResponse.success(res, revision, 201);
  } catch (err) {
    next(err);
  }
};

export const calculatePricing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pricing = await pricingRepo.calculate(
      req.params.projectId as string
    );
    ApiResponse.success(res, pricing);
  } catch (err) {
    next(err);
  }
};

export const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await paymentRepo.process(
      req.params.projectId as string
    );
    ApiResponse.success(res, payment);
  } catch (err) {
    next(err);
  }
};

export const publish = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await publishedSiteRepo.publish(
      req.params.projectId as string
    );
    ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
};
