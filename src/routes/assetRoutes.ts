import { Router } from "express";
import * as assetController from "../controllers/assetController";
import upload from "../middlewares/upload";

const router = Router();

router.post(
  "/:projectId/assets/upload",
  upload.single("file"),
  assetController.uploadAsset
);

router.post(
  "/:projectId/assets/upload-multiple",
  upload.array("files", 10),
  assetController.uploadMultiple
);

router.post(
  "/:projectId/assets",
  upload.array("files", 10),
  assetController.uploadMultiple
);

router.get("/:projectId/assets", assetController.getAssets);
router.delete("/:projectId/assets/:assetId", assetController.deleteAsset);

export default router;
