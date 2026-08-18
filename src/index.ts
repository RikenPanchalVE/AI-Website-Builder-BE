import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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

// Wide open (reflects any origin) by default — harmless for local dev and
// for a same-origin deployment, where the browser never even sends a
// cross-origin request here. Deployed with the frontend on a separate
// domain, set CORS_ORIGIN to that domain (e.g. https://aiwebsitebuilder.com)
// so the API only accepts requests from your real frontend instead of any
// site on the internet. Comma-separate multiple origins — e.g. the real
// frontend domain plus http://localhost:5173, so you can point a local
// `npm run dev` client at this live backend for testing without opening
// CORS up to everyone.
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : undefined;
app.use(cors(corsOrigins ? { origin: corsOrigins } : undefined));
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

// Single-server deployment: this Express process also serves the built
// React app, so the client's own relative `axios.baseURL = "/api"` keeps
// working unchanged in production (same origin, no CORS, no separate
// frontend host to configure). Gated on NODE_ENV=production (not just
// whether a dist/ happens to exist) so a stale local build never leaks
// into `npm run dev`, where the client is served by its own Vite dev
// server instead — see client/vite.config.ts's proxy. Registered after
// every /api route above, so those always match first; this only catches
// what's left.
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (process.env.NODE_ENV === "production" && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

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
