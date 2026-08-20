import { Router } from "express";
import * as contactSubmissionController from "../controllers/contactSubmissionController";

const router = Router();

// Fixed, non-project-scoped path - mounted directly at /api/contact
// (not under /api/projects/:projectId) so it's the exact same path a
// downloaded/exported site's own standalone server implements. See
// downloadService.ts's buildServerIndexJs.
router.post("/contact", contactSubmissionController.submit);

export default router;
