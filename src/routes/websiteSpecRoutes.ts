import { Router } from "express";
import * as websiteSpecController from "../controllers/websiteSpecController";
import * as downloadController from "../controllers/downloadController";

const router = Router();

router.post("/:projectId/generate", websiteSpecController.generate);
router.get("/:projectId/website-spec", websiteSpecController.getLatest);
router.get("/:projectId/website-spec/:version", websiteSpecController.getVersion);
router.post("/:projectId/approve", websiteSpecController.approve);

router.get("/:projectId/revisions", websiteSpecController.getRevisions);
router.post("/:projectId/revisions", websiteSpecController.createRevision);

router.post("/:projectId/pricing/calculate", websiteSpecController.calculatePricing);

router.post("/:projectId/payment/process", websiteSpecController.processPayment);

router.post("/:projectId/publish", websiteSpecController.publish);

router.get("/:projectId/download", downloadController.downloadSource);

export default router;
