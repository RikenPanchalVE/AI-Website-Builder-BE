import PublishedSite, { IPublishedSite } from "../models/PublishedSite";
import Project from "../models/Project";
import WebsiteSpecification from "../models/WebsiteSpecification";
import ApiError from "../utils/ApiError";
import fs from "fs";
import path from "path";
import { GENERATED_DIR } from "../config/constants";

interface ThemeData {
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  mutedColor?: string;
  mutedForegroundColor?: string;
  borderColor?: string;
  cardColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  buttonStyle?: string;
  animations?: boolean | string;
}

interface SiteSpec {
  name?: string;
  description?: string;
  logo?: string | null;
  theme?: ThemeData;
  pages?: Array<{
    slug: string;
    title: string;
    sections: Array<{
      id: string;
      component: string;
      props: Record<string, any>;
      order: number;
    }>;
  }>;
  navigation?: {
    items?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  };
  footer?: {
    copyright?: string;
    links?: Array<{ label: string; href: string }>;
    socialMedia?: Record<string, string>;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const esc = (str: unknown): string =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CLIENT_DIST = path.join(__dirname, "..", "..", "..", "client", "dist");

const findAsset = (dir: string, pattern: RegExp): string | null => {
  try {
    const files = fs.readdirSync(path.join(dir, "assets"));
    const match = files.find((f) => pattern.test(f));
    return match ? `./assets/${match}` : null;
  } catch {
    return null;
  }
};

const copyClientAssets = (buildDir: string): void => {
  const assetsDir = path.join(buildDir, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  try {
    const srcAssets = path.join(CLIENT_DIST, "assets");
    const files = fs.readdirSync(srcAssets);
    for (const file of files) {
      fs.copyFileSync(path.join(srcAssets, file), path.join(assetsDir, file));
    }
  } catch (err) {
    console.warn("Could not copy client assets:", err);
  }
  try {
    const favicon = path.join(CLIENT_DIST, "favicon.svg");
    if (fs.existsSync(favicon)) {
      fs.copyFileSync(favicon, path.join(buildDir, "favicon.svg"));
    }
  } catch { }
};

const generateShellHtml = (
  page: { slug: string; title: string },
  siteSpec: SiteSpec,
  projectId: string
): string => {
  const siteName = siteSpec.name || "My Store";
  const fontName = siteSpec.theme?.fontFamily || "Inter";
  const metaTitle = siteSpec.seo?.metaTitle
    ? `${siteSpec.seo.metaTitle} | ${siteName}`
    : `${page.title} | ${siteName}`;
  const metaDescription = siteSpec.seo?.metaDescription || page.title;

  const cssPath = findAsset(CLIENT_DIST, /\.css$/);
  const jsPath = findAsset(CLIENT_DIST, /generated-site.*\.js$/)
    || findAsset(CLIENT_DIST, /index-.*\.js$/);

  const siteDataForClient: Record<string, any> = {
    name: siteName,
    logo: siteSpec.logo || null,
    pages: siteSpec.pages || [],
    theme: siteSpec.theme,
    navigation: siteSpec.navigation,
    footer: siteSpec.footer,
    seo: siteSpec.seo,
    __basePath: `/generated-sites/${projectId}`,
  };

  const isHome = page.slug === "home" || page.slug === "index";
  const baseHref = isHome ? "./" : "../";

  const siteDataJson = JSON.stringify(siteDataForClient, null, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <base href="${baseHref}">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(metaDescription)}">
  <meta property="og:title" content="${esc(metaTitle)}">
  <meta property="og:description" content="${esc(metaDescription)}">
  <meta property="og:type" content="website">
  <title>${esc(metaTitle)}</title>
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  ${cssPath ? `<link rel="stylesheet" href="${cssPath}">` : ""}
</head>
<body>
  <div id="app"></div>
  <script type="application/json" id="site-data">${siteDataJson}</script>
  <script>window.__INITIAL_PAGE__ = ${JSON.stringify(page.slug || "home")};</script>
  ${jsPath ? `<script type="module" src="${jsPath}"></script>` : ""}
</body>
</html>`;
};

export const publish = async (projectId: string): Promise<IPublishedSite> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const spec = await WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
  if (!spec) throw new ApiError(400, "No website spec found");

  const siteSpec = (spec as unknown as SiteSpec);
  const siteName = siteSpec.name || project.name || "My Store";

  const buildDir = path.join(GENERATED_DIR, projectId);
  fs.mkdirSync(buildDir, { recursive: true });

  copyClientAssets(buildDir);

  const pages = siteSpec.pages || [];

  for (const page of pages) {
    const slug = page.slug || "index";
    const dir = slug === "home" || slug === "index"
      ? buildDir
      : path.join(buildDir, slug);
    fs.mkdirSync(dir, { recursive: true });

    const html = generateShellHtml(page, siteSpec, projectId);
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  }

  if (pages.length === 0) {
    const html = generateShellHtml(
      { slug: "home", title: siteName },
      siteSpec,
      projectId
    );
    fs.writeFileSync(path.join(buildDir, "index.html"), html, "utf-8");
  }

  const siteData = {
    projectId,
    version: spec.version,
    pages: spec.pages,
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(buildDir, "site.json"), JSON.stringify(siteData, null, 2), "utf-8");

  const existing = await PublishedSite.findOne({ project: project._id });
  // A bare relative URL only resolves correctly when whatever renders this
  // link (the admin dashboard) shares this server's origin. Deployed with
  // the frontend on a separate domain, PUBLIC_SERVER_URL (unset in that
  // single-server setup) prefixes it with this server's real public
  // origin so the "view published site" link stays correct either way -
  // same reasoning as assetService.ts's asset URLs.
  const PUBLIC_SERVER_URL = (process.env.PUBLIC_SERVER_URL || "").replace(/\/$/, "");
  const url = `${PUBLIC_SERVER_URL}/generated-sites/${projectId}`;

  if (existing) {
    existing.version = spec.version;
    existing.buildPath = buildDir;
    existing.url = url;
    existing.publishedAt = new Date();
    await existing.save();
    project.publishedSite = existing._id;
    project.status = "published";
    await project.save();
    return existing;
  }

  const published = await PublishedSite.create({
    project: project._id,
    version: spec.version,
    buildPath: buildDir,
    url,
    publishedAt: new Date(),
  });

  project.publishedSite = published._id;
  project.status = "published";
  await project.save();

  return published;
};

export const get = async (projectId: string): Promise<IPublishedSite | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return PublishedSite.findOne({ project: project._id });
};
