import * as questionnaireRepo from "../repositories/questionnaireRepository";
import * as projectRepo from "../repositories/projectRepository";
import { IQuestionnaireDoc } from "../models/Questionnaire";
import { IQuestionnaire } from "../types";

export const saveQuestionnaire = async (
  projectId: string,
  data: Record<string, any>
): Promise<IQuestionnaireDoc> => {
  const project = await projectRepo.findById(projectId);
  if (!project?.enquiry) {
    throw new Error("Project enquiry data not found");
  }

  const incoming = data.answers || data;

  // Support both old flat format and new nested WebsiteConfig format
  const businessType = incoming.business?.type || incoming.industry || project.enquiry.businessType || "";
  const businessName = incoming.business?.name || incoming.businessName || project.enquiry.businessName || "";

  // business.socialLinks is an array of { platform, url } — flatten to a
  // { platform: url } map, which is what MockAIProvider/components expect.
  const socialLinksArray: Array<{ platform?: string; url?: string }> =
    incoming.business?.socialLinks || incoming.socialLinks || [];
  const socialMedia: Record<string, string> = { ...(incoming.socialMedia || {}) };
  for (const link of socialLinksArray) {
    if (link?.platform && link?.url) {
      socialMedia[link.platform.toLowerCase()] = link.url;
    }
  }

  // Flatten the new WebsiteConfig into the answers format expected by MockAIProvider
  const mergedAnswers: Record<string, any> = {
    ...incoming,
    businessName,
    industry: businessType,
    businessDescription: incoming.business?.description || incoming.businessDescription || "",
    location: incoming.business?.location || incoming.location || "",
    // Real contact details the client actually typed in — must flow through
    // to the generated Contact page/footer instead of being discarded.
    phone: incoming.business?.phone || incoming.phone || project.enquiry.phone || "",
    email: incoming.business?.email || incoming.email || project.enquiry.email || "",
    address: incoming.business?.address || incoming.address || "",
    socialMedia,
    logo: incoming.branding?.logo || incoming.logo || null,
    // The image the client uploaded for image-based hero styles (Full-Screen
    // Statement, Image-Focused, etc.) — distinct from the generic per-project
    // asset list, so it doesn't get silently swapped out by whatever image
    // happens to be first in `assets` (e.g. a team photo).
    heroImage: incoming.branding?.bannerImages?.[0] || incoming.heroImage || null,
    themeStyle: incoming.theme?.style || incoming.themeStyle || "",
    primaryColor: incoming.theme?.primaryColor || incoming.primaryColor || "",
    secondaryColor: incoming.theme?.secondaryColor || incoming.secondaryColor || "",
    fontStyle: incoming.theme?.typography || incoming.fontStyle || "",
    themeMode: incoming.theme?.mode || incoming.themeMode || "auto",
    accentStyle: incoming.theme?.accentStyle || incoming.accentStyle || "",
    pages: incoming.pages || [],
    homepageSections: incoming.sections?.home || Object.values(incoming.sections || {}).flat() as string[],
    pageSections: incoming.sections || {},
    selectedPages: incoming.pages || [],
    // Pass through content items
    services: incoming.content?.services || [],
    testimonials: incoming.content?.testimonials || [],
    faq: incoming.content?.faq || [],
    portfolioItems: incoming.content?.portfolio || [],
    galleryImages: incoming.content?.gallery || [],
    teamMembers: incoming.content?.team || [],
    whyChooseUsReasons: incoming.content?.whyChooseUs || [],
    aboutValues: incoming.content?.aboutValues || [],
    pricingPlans: incoming.content?.pricingPlans || [],
    menuItems: incoming.content?.menuItems || [],
    dailySpecials: incoming.content?.dailySpecials || [],
    blogPosts: incoming.content?.blogPosts || [],
    stats: incoming.content?.stats || [],
    timeline: incoming.content?.timeline || [],
    businessHours: incoming.content?.businessHours || [],
    classSchedule: incoming.content?.classSchedule || [],
    courses: incoming.content?.courses || [],
    destinations: incoming.content?.destinations || [],
    solutions: incoming.content?.solutions || [],
    industries: incoming.content?.industries || [],
    caseStudies: incoming.content?.caseStudies || [],
    rooms: incoming.content?.rooms || [],
    amenities: incoming.content?.amenities || [],
    experiences: incoming.content?.experiences || [],
    travelPackages: incoming.content?.travelPackages || [],
    process: incoming.content?.process || [],
    programs: incoming.content?.programs || [],
    facilities: incoming.content?.facilities || [],
    skills: incoming.content?.skills || [],
    // Site-wide footer text overrides (tagline/copyright/CTA) — optional,
    // MockAIProvider falls back to the auto-generated defaults for anything
    // left blank.
    footerContent: incoming.content?.footer || {},
    contactContent: incoming.content?.contact || {},
    // Component selections
    componentSelections: incoming.components || {},
  };

  const existing = await questionnaireRepo.findByProject(projectId);
  if (existing) {
    return questionnaireRepo.update(projectId, { answers: mergedAnswers }) as Promise<IQuestionnaireDoc>;
  }
  return questionnaireRepo.create(projectId, { answers: mergedAnswers });
};

export const getQuestionnaire = async (
  projectId: string
): Promise<IQuestionnaireDoc | null> => {
  return questionnaireRepo.findByProject(projectId);
};

export const updateQuestionnaire = async (
  projectId: string,
  data: Partial<IQuestionnaire>
): Promise<IQuestionnaireDoc | null> => {
  return questionnaireRepo.update(projectId, data);
};
