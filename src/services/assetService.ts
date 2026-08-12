import * as assetRepo from "../repositories/assetRepository";
import { IAsset } from "../models/Asset";
import fs from "fs";

// Assets are stored with an absolute filesystem `path`, which isn't a valid
// browser URL. The server serves /uploads statically (see index.ts) and
// upload middleware writes files to uploads/{projectId}/{filename}, so build
// the actual browser-accessible URL here instead of leaking the raw path.
const withUrl = (asset: IAsset, projectId: string): Record<string, unknown> => ({
  ...asset.toObject(),
  url: `/uploads/${projectId}/${asset.filename}`,
});

export const uploadAsset = async (
  projectId: string,
  file: Express.Multer.File,
  type: string
): Promise<Record<string, unknown>> => {
  const asset = await assetRepo.create(projectId, file, type);
  return withUrl(asset, projectId);
};

export const getAssets = async (projectId: string): Promise<Record<string, unknown>[]> => {
  const assets = await assetRepo.findByProject(projectId);
  return assets.map((a) => withUrl(a, projectId));
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
