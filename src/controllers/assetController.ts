import { Request, Response, NextFunction } from "express";
import * as assetService from "../services/assetService";
import ApiResponse from "../utils/ApiResponse";

export const uploadAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    const type = (req.body.type as string) || "image";
    const asset = await assetService.uploadAsset(
      req.params.projectId as string,
      req.file,
      type
    );
    ApiResponse.success(res, asset, 201);
  } catch (err) {
    next(err);
  }
};

export const uploadMultiple = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ success: false, message: "No files uploaded" });
      return;
    }
    const files = req.files as Express.Multer.File[];
    const type = (req.body.type as string) || "image";

    const results = await Promise.all(
      files.map((file) =>
        assetService.uploadAsset(req.params.projectId as string, file, type)
      )
    );

    ApiResponse.success(res, results, 201);
  } catch (err) {
    next(err);
  }
};

export const getAssets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assets = await assetService.getAssets(req.params.projectId as string);
    ApiResponse.success(res, assets);
  } catch (err) {
    next(err);
  }
};

export const deleteAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await assetService.deleteAsset(req.params.assetId as string);
    ApiResponse.success(res, { message: "Asset deleted" });
  } catch (err) {
    next(err);
  }
};
