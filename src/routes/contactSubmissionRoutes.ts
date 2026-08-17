import { Router } from "express";
import * as contactSubmissionController from "../controllers/contactSubmissionController";

const router = Router();

// Project-scoped — lets the business owner see leads captured from their
// site's Contact form. Mounted under /api/projects alongside the other
// project-scoped routers.
router.get("/:projectId/contact-submissions", contactSubmissionController.list);

export default router;
