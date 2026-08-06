import * as assetRepo from "../repositories/assetRepository";
import { IAsset } from "../models/Asset";
import fs from "fs";

export const uploadAsset = async (
  projectId: string,
  file: Express.Multer.File,
  type: string
): Promise<IAsset> => {
  return assetRepo.create(projectId, file, type);
};

export const getAssets = async (projectId: string): Promise<IAsset[]> => {
  return assetRepo.findByProject(projectId);
};

export const deleteAsset = async (assetId: string): Promise<IAsset | null> => {
  const asset = await assetRepo.findById(assetId);
  if (asset) {
    try {
      fs.unlinkSync(asset.path);
    } catch {
      // File may already be deleted
    }
  }
  return assetRepo.remove(assetId);
};
