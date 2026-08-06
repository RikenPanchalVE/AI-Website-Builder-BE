import { Request, Response, NextFunction } from "express";
import * as revisionService from "../services/revisionService";
import ApiResponse from "../utils/ApiResponse";

export const submitRevision = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { request } = req.body as { request: string };
    const revision = await revisionService.submitRevision(
      req.params.projectId as string,
      request
    );
    ApiResponse.success(res, revision, 201);
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
    const revisions = await revisionService.getRevisions(
      req.params.projectId as string
    );
    ApiResponse.success(res, revisions);
  } catch (err) {
    next(err);
  }
};

export const updateRevisionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body as { status: "pending" | "applied" | "rejected" };
    const revision = await revisionService.updateRevisionStatus(
      req.params.revisionId as string,
      status
    );
    ApiResponse.success(res, revision);
  } catch (err) {
    next(err);
  }
};
