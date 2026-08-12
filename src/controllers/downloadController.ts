import { Request, Response, NextFunction } from "express";
import * as downloadService from "../services/downloadService";

export const downloadSource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { archive, filename } = await downloadService.buildProjectArchive(
      req.params.projectId as string
    );
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    archive.on("error", (err) => next(err));
    archive.pipe(res);
    archive.finalize();
  } catch (err) {
    next(err);
  }
};
