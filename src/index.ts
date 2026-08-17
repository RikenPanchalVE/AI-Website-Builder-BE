import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import projectRoutes from "./routes/projectRoutes";
import assetRoutes from "./routes/assetRoutes";
import websiteSpecRoutes from "./routes/websiteSpecRoutes";
import revisionRoutes from "./routes/revisionRoutes";
import billingRoutes from "./routes/billingRoutes";
import contactSubmissionRoutes from "./routes/contactSubmissionRoutes";
import contactRoutes from "./routes/contactRoutes";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/generated-sites", express.static(path.join(__dirname, "..", "generated-sites")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/projects", projectRoutes);
app.use("/api/projects", assetRoutes);
app.use("/api/projects", websiteSpecRoutes);
app.use("/api/projects", revisionRoutes);
app.use("/api/projects", billingRoutes);
app.use("/api/projects", contactSubmissionRoutes);
// Fixed path (not project-scoped) — same one a downloaded site's own
// standalone server implements, see downloadService.ts.
app.use("/api", contactRoutes);

app.use(errorHandler);

const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
