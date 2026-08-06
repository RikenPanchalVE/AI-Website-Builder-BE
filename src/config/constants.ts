import path from "path";

export const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
export const GENERATED_DIR = path.join(__dirname, "..", "..", "generated-sites");
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
