import { Router } from "express";
import * as revisionController from "../controllers/revisionController";

const router = Router();

router.post("/:projectId/revisions", revisionController.submitRevision);
router.get("/:projectId/revisions", revisionController.getRevisions);
router.patch("/:projectId/revisions/:revisionId", revisionController.updateRevisionStatus);

export default router;
