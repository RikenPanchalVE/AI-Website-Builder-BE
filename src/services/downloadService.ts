import fs from "fs";
import path from "path";
import archiver from "archiver";
import * as projectRepo from "../repositories/projectRepository";
import * as websiteSpecService from "./websiteSpecService";
import ApiError from "../utils/ApiError";

// Reaches the client's source tree from wherever this file ends up running
// from (server/src/services in dev via tsx, server/dist/services once
// built) - same "three levels up to the repo root" pattern already used by
// publishedSiteRepository.ts for CLIENT_DIST.
const CLIENT_SRC = path.join(__dirname, "..", "..", "..", "client", "src");

// Same "wherever this file ends up running from" logic, but only two levels
// up - server/src/services or server/dist/services are both two levels
// below server/, where uploaded assets actually live on disk (see
// index.ts's `express.static(path.join(__dirname, "..", "uploads"))`).
const UPLOADS_ROOT = path.join(__dirname, "..", "..", "uploads");

interface ComponentSource {
  // Path to the source file, relative to client/src/component-library.
  file: string;
  // Files that export a single default (one component per file, code-split
  // via React.lazy in the real app) vs. files that export several named
  // components from a shared file (e.g. Common/index.tsx).
  kind: "default" | "named";
  // Only needed when the registry key differs from the actual export name
  // (the app aliases both industries' "ServicePackages" export on import).
  exportName?: string;
  // Other component-library files this one imports internally (e.g. every
  // Footer imports SocialIcon from Common/index.tsx) - these need to be
  // copied into the archive too, but aren't registry entries themselves, so
  // they don't get an import/registry line of their own. Forgetting to
  // declare one here is exactly how a download used to ship a Footer whose
  // build failed on a missing "@/component-library/Common" module - the
  // site always has a footer, but Common/index.tsx was only ever pulled in
  // when the site happened to also use one of its *named* exports.
  extraFiles?: string[];
}

// Mirrors client/src/renderer/ComponentRegistry.ts exactly, just as data -
// lets the download build a trimmed registry containing only the
// components this specific generated site actually uses, instead of
// shipping every industry's entire component library.
const COMPONENT_SOURCE_MAP: Record<string, ComponentSource> = {
  Navbar1: { file: "Navbar/Navbar1.tsx", kind: "default" },
  Navbar2: { file: "Navbar/Navbar2.tsx", kind: "default" },
  Navbar3: { file: "Navbar/Navbar3.tsx", kind: "default" },
  Hero1: { file: "Hero/Hero1.tsx", kind: "default" },
  Hero2: { file: "Hero/Hero2.tsx", kind: "default" },
  Hero3: { file: "Hero/Hero3.tsx", kind: "default" },
  Hero4: { file: "Hero/Hero4.tsx", kind: "default" },
  Hero5: { file: "Hero/Hero5.tsx", kind: "default" },
  About1: { file: "About/About1.tsx", kind: "default" },
  About2: { file: "About/About2.tsx", kind: "default" },
  Services1: { file: "Services/Services1.tsx", kind: "default" },
  Services2: { file: "Services/Services2.tsx", kind: "default" },
  Services3: { file: "Services/Services3.tsx", kind: "default" },
  Services4: { file: "Services/Services4.tsx", kind: "default" },
  Gallery1: { file: "Gallery/Gallery1.tsx", kind: "default" },
  Gallery2: { file: "Gallery/Gallery2.tsx", kind: "default" },
  Portfolio1: { file: "Portfolio/Portfolio1.tsx", kind: "default" },
  Portfolio2: { file: "Portfolio/Portfolio2.tsx", kind: "default" },
  Portfolio3: { file: "Portfolio/Portfolio3.tsx", kind: "default" },
  Pricing1: { file: "Pricing/Pricing1.tsx", kind: "default" },
  Pricing2: { file: "Pricing/Pricing2.tsx", kind: "default" },
  FAQ1: { file: "FAQ/FAQ1.tsx", kind: "default" },
  FAQ2: { file: "FAQ/FAQ2.tsx", kind: "default" },
  Testimonials1: { file: "Testimonials/Testimonials1.tsx", kind: "default" },
  Testimonials2: { file: "Testimonials/Testimonials2.tsx", kind: "default" },
  Testimonials3: { file: "Testimonials/Testimonials3.tsx", kind: "default" },
  CTA1: { file: "CTA/CTA1.tsx", kind: "default" },
  CTA2: { file: "CTA/CTA2.tsx", kind: "default" },
  Contact1: { file: "Contact/Contact1.tsx", kind: "default" },
  Contact2: { file: "Contact/Contact2.tsx", kind: "default" },
  Footer1: { file: "Footer/Footer1.tsx", kind: "default", extraFiles: ["Common/index.tsx"] },
  Footer2: { file: "Footer/Footer2.tsx", kind: "default", extraFiles: ["Common/index.tsx"] },
  Footer3: { file: "Footer/Footer3.tsx", kind: "default", extraFiles: ["Common/index.tsx"] },

  WhyChooseUs: { file: "Common/index.tsx", kind: "named" },
  WhyChooseUs2: { file: "Common/index.tsx", kind: "named" },
  Testimonials: { file: "Common/index.tsx", kind: "named" },
  BrandShowcase: { file: "Common/index.tsx", kind: "named" },
  NewsletterSignup: { file: "Common/index.tsx", kind: "named" },
  InstagramFeed: { file: "Common/index.tsx", kind: "named" },
  FAQPreview: { file: "Common/index.tsx", kind: "named" },
  ContactPreview: { file: "Common/index.tsx", kind: "named" },
  StoreLocator: { file: "Common/index.tsx", kind: "named" },
  PageHero: { file: "Common/index.tsx", kind: "named" },
  Breadcrumbs: { file: "Common/index.tsx", kind: "named" },
  AboutStory: { file: "Common/index.tsx", kind: "named" },
  AboutStory2: { file: "Common/index.tsx", kind: "named" },
  AboutValues: { file: "Common/index.tsx", kind: "named" },
  AboutValues2: { file: "Common/index.tsx", kind: "named" },
  Stats: { file: "Common/index.tsx", kind: "named" },
  Stats2: { file: "Common/index.tsx", kind: "named" },
  Timeline: { file: "Common/index.tsx", kind: "named" },
  Timeline2: { file: "Common/index.tsx", kind: "named" },
  BusinessHours: { file: "Common/index.tsx", kind: "named" },
  BusinessHours2: { file: "Common/index.tsx", kind: "named" },
  ClassSchedule: { file: "Common/index.tsx", kind: "named" },
  TeamSection: { file: "Common/index.tsx", kind: "named" },
  TeamSection2: { file: "Common/index.tsx", kind: "named" },
  CTABanner: { file: "Common/index.tsx", kind: "named" },
  ContactInfo: { file: "Common/index.tsx", kind: "named" },
  ContactInfo2: { file: "Common/index.tsx", kind: "named" },
  ContactForm: { file: "Common/index.tsx", kind: "named" },
  MapEmbed: { file: "Common/index.tsx", kind: "named" },
  MapEmbed2: { file: "Common/index.tsx", kind: "named" },
  BlogGrid: { file: "Common/index.tsx", kind: "named" },
  FAQAccordion: { file: "Common/index.tsx", kind: "named" },
  LegalContent: { file: "Common/index.tsx", kind: "named" },
  BlogPreview: { file: "Common/index.tsx", kind: "named" },

  MenuHighlights: { file: "Restaurant/index.tsx", kind: "named" },
  MenuHighlights2: { file: "Restaurant/index.tsx", kind: "named" },
  DailySpecials: { file: "Restaurant/index.tsx", kind: "named" },
  DailySpecials2: { file: "Restaurant/index.tsx", kind: "named" },
  ChefTable: { file: "Restaurant/index.tsx", kind: "named" },

  Services: { file: "Healthcare/index.tsx", kind: "named" },
  AppointmentBooking: { file: "Healthcare/index.tsx", kind: "named" },
  DoctorProfiles: { file: "Healthcare/index.tsx", kind: "named" },
  DoctorProfiles2: { file: "Healthcare/index.tsx", kind: "named" },
  HealthResources: { file: "Healthcare/index.tsx", kind: "named" },

  CourseGrid: { file: "Education/index.tsx", kind: "named" },
  CourseGrid2: { file: "Education/index.tsx", kind: "named" },
  LearningPaths: { file: "Education/index.tsx", kind: "named" },
  LearningPaths2: { file: "Education/index.tsx", kind: "named" },
  StudentSuccess: { file: "Education/index.tsx", kind: "named" },
  InstructorProfiles: { file: "Education/index.tsx", kind: "named" },
  InstructorProfiles2: { file: "Education/index.tsx", kind: "named" },

  PropertyGrid: { file: "RealEstate/index.tsx", kind: "named" },
  PropertySearch: { file: "RealEstate/index.tsx", kind: "named" },
  NeighborhoodGuide: { file: "RealEstate/index.tsx", kind: "named" },
  AgentProfiles: { file: "RealEstate/index.tsx", kind: "named" },
  AgentProfiles2: { file: "RealEstate/index.tsx", kind: "named" },

  DestinationGrid: { file: "Travel/index.tsx", kind: "named" },
  DestinationGrid2: { file: "Travel/index.tsx", kind: "named" },
  TravelDeals: { file: "Travel/index.tsx", kind: "named" },
  TravelDeals2: { file: "Travel/index.tsx", kind: "named" },
  PackageGrid: { file: "Travel/index.tsx", kind: "named" },
  TravelGuides: { file: "Travel/index.tsx", kind: "named" },

  PetCareTips: { file: "PetStore/index.tsx", kind: "named" },
  PetGroomingBooking: { file: "PetStore/index.tsx", kind: "named" },

  VehicleCard: { file: "Automotive/index.tsx", kind: "named" },
  VehicleGrid: { file: "Automotive/index.tsx", kind: "named" },
  AutomotiveServicePackages: { file: "Automotive/index.tsx", kind: "named", exportName: "ServicePackages" },

  HomeServicePackages: { file: "HomeServices/index.tsx", kind: "named", exportName: "ServicePackages" },
  BeforeAfterGallery: { file: "HomeServices/index.tsx", kind: "named" },
};

function slugify(name: string): string {
  return (
    (name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "website"
  );
}

function collectUsedComponents(pages: Array<{ sections?: Array<{ component?: string }> }>): string[] {
  const used = new Set<string>();
  for (const page of pages || []) {
    for (const section of page.sections || []) {
      if (section.component) used.add(section.component);
    }
  }
  return Array.from(used);
}

// Every uploaded logo/hero/gallery/portfolio/team image is referenced as a
// root-relative "/uploads/<projectId>/<filename>" URL, served by *this*
// server's own uploads folder - not by the standalone site the download
// produces. Left alone, every uploaded image would 404 once downloaded and
// self-hosted. Walk the entire site data structure (any field, any nesting
// depth - content items carry image URLs under all kinds of keys) rather
// than hardcoding a list of "the fields that might have images", and bundle
// whatever's actually referenced as static files the client serves itself.
// `seen` guards against circular references - the raw (pre-JSON) siteData
// can still hold Mongoose document/subdocument internals with parent
// back-references even after the top-level spec fields were destructured
// out, and walking those with a plain Object.values recursion overflows
// the call stack instead of terminating.
function collectUploadUrls(value: unknown, found: Set<string>, seen: WeakSet<object> = new WeakSet()): void {
  if (typeof value === "string") {
    if (value.startsWith("/uploads/")) found.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUploadUrls(item, found, seen);
    return;
  }
  if (value && typeof value === "object") {
    if (seen.has(value)) return;
    seen.add(value);
    for (const v of Object.values(value as Record<string, unknown>)) collectUploadUrls(v, found, seen);
  }
}

function buildComponentRegistrySource(usedComponents: string[]): string {
  const defaultImportLines: string[] = [];
  const namedImportsByFile = new Map<string, Array<{ exportName: string; localName: string }>>();
  const registryEntryLines: string[] = [];

  for (const name of usedComponents.sort()) {
    const entry = COMPONENT_SOURCE_MAP[name];
    if (!entry) continue; // unrecognized/legacy component name - skip rather than break the export

    if (entry.kind === "default") {
      const importPath = `../component-library/${entry.file.replace(/\.tsx$/, "")}`;
      defaultImportLines.push(`  ${name}: lazy(() => import("${importPath}")),`);
    } else {
      const list = namedImportsByFile.get(entry.file) || [];
      list.push({ exportName: entry.exportName || name, localName: name });
      namedImportsByFile.set(entry.file, list);
      registryEntryLines.push(`  ${name},`);
    }
  }

  const namedImportBlocks: string[] = [];
  for (const [file, names] of namedImportsByFile) {
    const importPath = `../component-library/${file.replace(/\.tsx$/, "")}`;
    const specifiers = names
      .map((n) => (n.exportName === n.localName ? n.exportName : `${n.exportName} as ${n.localName}`))
      .join(", ");
    namedImportBlocks.push(`import { ${specifiers} } from "${importPath}";`);
  }

  return `import { lazy } from "react";

${namedImportBlocks.join("\n")}

const ComponentRegistry: Record<string, React.ComponentType<any>> = {
${defaultImportLines.join("\n")}
${registryEntryLines.join("\n")}
};

export default ComponentRegistry;
`;
}

function buildIndexHtml(siteName: string, description: string, fontFamily: string, siteData: Record<string, unknown>): string {
  const esc = (s: string) =>
    String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const font = (fontFamily || "Inter").split(",")[0].trim().replace(/['"]/g, "");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(description)}" />
    <title>${esc(siteName)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font).replace(/%20/g, "+")}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="application/json" id="site-data">${JSON.stringify(siteData)}</script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function buildClientPackageJson(folderName: string): string {
  return JSON.stringify(
    {
      name: `${folderName}-website`,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.2.8",
        "react-dom": "^19.2.8",
      },
      devDependencies: {
        "@tailwindcss/vite": "^4.3.3",
        "@types/node": "^26.1.2",
        "@types/react": "^19.2.18",
        "@types/react-dom": "^19.2.4",
        "@vitejs/plugin-react": "^6.0.4",
        tailwindcss: "^4.3.3",
        typescript: "^7.0.2",
        vite: "^8.2.0",
      },
    },
    null,
    2
  );
}

function buildClientViteConfig(): string {
  // The "@" alias is required - Footer1/2/3 import SocialIcon via
  // "@/component-library/Common", same as the main app.
  return `import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
`;
}

function buildClientTsconfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true,
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["src"],
    },
    null,
    2
  );
}

function buildMainTsx(): string {
  // Adapted verbatim from client/src/generated-site.tsx - the exact entry
  // point already used to render a published site from an embedded
  // <script id="site-data"> blob, with pushState-based page navigation.
  return `import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import WebsiteRenderer from "./renderer/WebsiteRenderer";
import "./index.css";

function getSiteData(): any {
  const el = document.getElementById("site-data");
  if (el && el.textContent) {
    try { return JSON.parse(el.textContent); } catch { return null; }
  }
  return null;
}

function getPageFromUrl(): string {
  const segments = window.location.pathname.replace(/^\\/+/, "").replace(/\\/+$/, "").split("/");
  const slug = segments[0] || "home";
  if (slug === "index.html" || slug === "") return "home";
  return slug;
}

function slugToUrlPath(slug: string): string {
  return slug === "home" || slug === "index" ? "/" : \`/\${slug}\`;
}

function App() {
  const [data] = useState(() => getSiteData());
  const [currentPage, setCurrentPage] = useState<string>(getPageFromUrl());

  useEffect(() => {
    const onPopState = () => setCurrentPage(getPageFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
        No site data found
      </div>
    );
  }

  const handleNavigate = (slug: string) => {
    setCurrentPage(slug);
    const newPath = slugToUrlPath(slug);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <WebsiteRenderer
      data={data}
      currentPage={currentPage}
      onNavigatePage={handleNavigate}
    />
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
`;
}

function buildServerPackageJson(folderName: string): string {
  return JSON.stringify(
    {
      name: `${folderName}-server`,
      private: true,
      version: "1.0.0",
      main: "index.js",
      scripts: {
        start: "node index.js",
        // Alias - this is a plain static file server, there's nothing to
        // watch/rebuild, but "npm run dev" is what people reach for out of
        // habit (and what the main app's own server uses), so it should
        // work too instead of failing with "Missing script: dev".
        dev: "node index.js",
      },
      dependencies: {
        express: "^5.2.1",
      },
    },
    null,
    2
  );
}

function buildServerIndexJs(): string {
  return `// Minimal static file server for the built website (client/dist).
// Run "npm run build" inside ../client first, then "npm start" here.
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

// This site has no real database - submissions from the Contact page's
// form are appended to a local JSON file instead. Open data/contact-
// submissions.json to see them, or swap this route out for whatever
// backend/CRM you actually want to wire up.
const DATA_DIR = path.join(__dirname, "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "contact-submissions.json");

app.use(express.json());

// Same fixed path the main website builder's own server implements (see
// server/src/routes/contactRoutes.ts there) - the Contact form component
// is the exact same code in both places and always posts here.
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required" });
  }

  let submissions = [];
  try {
    submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
  } catch {
    submissions = [];
  }
  submissions.push({
    name: String(name).trim(),
    email: String(email).trim(),
    subject: subject ? String(subject).trim() : "",
    message: String(message).trim(),
    submittedAt: new Date().toISOString(),
  });

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

  res.status(201).json({ success: true });
});

app.use(express.static(CLIENT_DIST));

// Every unmatched route falls back to index.html - the site does its own
// client-side page routing (see client/src/main.tsx).
app.use((req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(\`Website running at http://localhost:\${PORT}\`);
});
`;
}

function buildGitignore(extra: string[]): string {
  return ["node_modules/", ...extra, ""].join("\n");
}

function buildReadme(businessName: string): string {
  return `# ${businessName} - Website Source

This is the source code for your generated website. It only includes the
pages and components your site actually uses - not the website builder
itself.

## 1. Build the site

\`\`\`
cd client
npm install
npm run build
\`\`\`

This produces a static, production-ready build in \`client/dist\`.

## 2. Run it

\`\`\`
cd server
npm install
npm start
\`\`\`

Then open http://localhost:3000 in your browser.

## Contact form submissions

If your site has a Contact page, submissions are saved to
\`server/data/contact-submissions.json\` - there's no database to set up.
Open that file any time to see the leads that have come in.

## Development

To edit and preview the site with hot-reload instead of a full build, run
\`npm run dev\` inside \`client/\` and open the printed local URL.
`;
}

export const buildProjectArchive = async (
  projectId: string
): Promise<{ archive: archiver.Archiver; filename: string }> => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (!["paid", "published"].includes(project.status)) {
    throw new ApiError(403, "Complete payment before downloading your website's source code");
  }

  const spec = await websiteSpecService.getLatestSpec(projectId);
  if (!spec) throw new ApiError(400, "No generated website found for this project");

  const businessName = spec.name || project.enquiry?.businessName || project.name || "My Website";
  const folderName = slugify(businessName);

  const pages = (spec.pages as any[]) || [];
  const usedComponents = collectUsedComponents(pages);

  const siteData = {
    name: spec.name,
    description: spec.description,
    logo: spec.logo || null,
    pages,
    theme: spec.theme || {},
    navigation: spec.navigation || {},
    footer: spec.footer || {},
  };

  const archive = archiver("zip", { zlib: { level: 9 } });

  // ── client/ ──────────────────────────────────────────────────────────
  archive.append(buildClientPackageJson(folderName), { name: `${folderName}/client/package.json` });
  archive.append(buildClientTsconfig(), { name: `${folderName}/client/tsconfig.json` });
  archive.append(buildClientViteConfig(), { name: `${folderName}/client/vite.config.ts` });
  archive.append(buildGitignore(["dist/"]), { name: `${folderName}/client/.gitignore` });
  archive.append(
    buildIndexHtml(businessName, spec.description || "", (spec.theme as any)?.fontFamily || "Inter", siteData),
    { name: `${folderName}/client/index.html` }
  );
  archive.append(buildMainTsx(), { name: `${folderName}/client/src/main.tsx` });

  const indexCssPath = path.join(CLIENT_SRC, "index.css");
  if (fs.existsSync(indexCssPath)) {
    archive.file(indexCssPath, { name: `${folderName}/client/src/index.css` });
  }

  const rendererPath = path.join(CLIENT_SRC, "renderer", "WebsiteRenderer.tsx");
  if (fs.existsSync(rendererPath)) {
    archive.file(rendererPath, { name: `${folderName}/client/src/renderer/WebsiteRenderer.tsx` });
  }

  archive.append(buildComponentRegistrySource(usedComponents), {
    name: `${folderName}/client/src/renderer/ComponentRegistry.ts`,
  });

  // Only the component-library files this site's sections actually
  // reference get copied in - everything else (other industries' widgets,
  // the questionnaire, the builder dashboard) is left out entirely.
  const includedFiles = new Set<string>();
  for (const name of usedComponents) {
    const entry = COMPONENT_SOURCE_MAP[name];
    if (!entry) continue;
    includedFiles.add(entry.file);
    for (const extra of entry.extraFiles || []) includedFiles.add(extra);
  }
  for (const file of includedFiles) {
    const filePath = path.join(CLIENT_SRC, "component-library", file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: `${folderName}/client/src/component-library/${file}` });
    }
  }

  // Bundle only the uploaded images this site actually references (logo,
  // hero/banner images, gallery/portfolio/team photos, etc.) as static
  // files under client/public/uploads/ - Vite's public dir is served
  // (and, on build, copied) at the site root, so the "/uploads/..." URLs
  // already embedded in siteData keep working completely unchanged, with
  // no rewriting needed anywhere.
  const uploadUrls = new Set<string>();
  collectUploadUrls(siteData, uploadUrls);
  for (const url of uploadUrls) {
    const relPath = url.replace(/^\/uploads\//, "");
    // Guard against a malformed/hostile relative path escaping uploads/
    // (e.g. "../../etc/passwd") before it ever touches the filesystem.
    if (relPath.split("/").some((seg) => seg === "..")) continue;
    const diskPath = path.join(UPLOADS_ROOT, relPath);
    if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
      archive.file(diskPath, { name: `${folderName}/client/public/uploads/${relPath}` });
    }
  }

  // ── server/ ──────────────────────────────────────────────────────────
  archive.append(buildServerPackageJson(folderName), { name: `${folderName}/server/package.json` });
  archive.append(buildServerIndexJs(), { name: `${folderName}/server/index.js` });
  // data/ holds contact-form submissions (real customer names/emails/
  // messages once this is deployed) - shouldn't end up committed to git.
  archive.append(buildGitignore(["data/"]), { name: `${folderName}/server/.gitignore` });

  archive.append(buildReadme(businessName), { name: `${folderName}/README.md` });

  return { archive, filename: `${folderName}-website.zip` };
};
