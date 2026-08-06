import Asset, { IAsset } from "../models/Asset";
import Project from "../models/Project";
import ApiError from "../utils/ApiError";
import { AssetType } from "../types";

export const create = async (
  projectId: string,
  file: Express.Multer.File,
  type: string
): Promise<IAsset> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const asset = await Asset.create({
    project: project._id,
    type: type as AssetType,
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimeType: file.mimetype,
  });

  project.assets.push(asset._id);
  project.status = "assets_uploaded";
  await project.save();

  return asset;
};

export const findByProject = async (projectId: string): Promise<IAsset[]> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Asset.find({ project: project._id });
};

export const findById = async (assetId: string): Promise<IAsset | null> => {
  return Asset.findById(assetId);
};

export const remove = async (assetId: string): Promise<IAsset | null> => {
  const asset = await Asset.findByIdAndDelete(assetId);
  if (asset) {
    await Project.findByIdAndUpdate(asset.project, {
      $pull: { assets: asset._id },
    });
  }
  return asset;
};
