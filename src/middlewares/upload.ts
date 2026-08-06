import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { UPLOAD_DIR, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../config/constants";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const projectId = (req.params as Record<string, string>).projectId || "unknown";
    const dir = path.join(UPLOAD_DIR, projectId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
