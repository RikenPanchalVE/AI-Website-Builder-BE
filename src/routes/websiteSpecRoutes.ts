import { Router } from "express";
import * as websiteSpecController from "../controllers/websiteSpecController";

const router = Router();

router.post("/:projectId/generate", websiteSpecController.generate);
router.get("/:projectId/website-spec", websiteSpecController.getLatest);
router.get("/:projectId/website-spec/:version", websiteSpecController.getVersion);
router.post("/:projectId/approve", websiteSpecController.approve);

export default router;
