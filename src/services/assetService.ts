import * as assetRepo from "../repositories/assetRepository";
import { IAsset } from "../models/Asset";
import fs from "fs";

// Assets are stored with an absolute filesystem `path`, which isn't a valid
// browser URL. The server serves /uploads statically (see index.ts) and
// upload middleware writes files to uploads/{projectId}/{filename}, so build
// the actual browser-accessible URL here instead of leaking the raw path.
//
// A bare relative URL only resolves correctly when the browser is on the
// same origin as this server (single-server deployment, or local dev via
// Vite's proxy). Deployed with the frontend and API on separate domains,
// an <img src="/uploads/..."> rendered on the frontend's own domain would
// request that path from the FRONTEND's host, not this one, and 404 —
// PUBLIC_SERVER_URL (set only in that split-domain setup) prefixes every
// asset URL with this server's real public origin so it stays correct no
// matter which domain the page rendering it is on.
const PUBLIC_SERVER_URL = (process.env.PUBLIC_SERVER_URL || "").replace(/\/$/, "");
const withUrl = (asset: IAsset, projectId: string): Record<string, unknown> => ({
  ...asset.toObject(),
  url: `${PUBLIC_SERVER_URL}/uploads/${projectId}/${asset.filename}`,
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
