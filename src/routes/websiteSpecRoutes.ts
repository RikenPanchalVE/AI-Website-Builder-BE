import { Router } from "express";
import * as websiteSpecController from "../controllers/websiteSpecController";
import * as downloadController from "../controllers/downloadController";

const router = Router();

router.post("/:projectId/generate", websiteSpecController.generate);
router.get("/:projectId/website-spec", websiteSpecController.getLatest);
router.get("/:projectId/website-spec/:version", websiteSpecController.getVersion);
router.post("/:projectId/approve", websiteSpecController.approve);

// GET/POST /:projectId/revisions live in revisionRoutes.ts (mounted after
// this router at the same /api/projects prefix) - they used to be
// duplicated here too, calling revisionRepo directly and shadowing
// revisionRoutes' handlers entirely (Express matches whichever router was
// registered first), so revisionController/revisionService's actual logic
// was silently never reached.

router.post("/:projectId/pricing/calculate", websiteSpecController.calculatePricing);

router.post("/:projectId/payment/process", websiteSpecController.processPayment);

router.post("/:projectId/publish", websiteSpecController.publish);

router.get("/:projectId/download", downloadController.downloadSource);

export default router;
