import { Request, Response, NextFunction } from "express";
import * as contactSubmissionService from "../services/contactSubmissionService";

// Mounted at the fixed, non-project-scoped POST /api/contact - the exact
// same path a downloaded/exported site's own standalone server implements
// (see downloadService.ts), so Contact1/Contact2's form can always submit
// to "/api/contact" regardless of whether it's rendering inside the
// builder, a published site, or a downloaded export. `projectId` (if any)
// travels in the body instead of the URL for that reason.
export const submit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const submission = await contactSubmissionService.submitContactForm(req.body);
    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const submissions = await contactSubmissionService.getSubmissions(req.params.projectId as string);
    res.json({ success: true, data: submissions });
  } catch (err) {
    next(err);
  }
};
