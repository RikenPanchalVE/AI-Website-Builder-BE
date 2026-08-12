import Pricing, { IPricing } from "../models/Pricing";
import Project from "../models/Project";
import Revision from "../models/Revision";
import ApiError from "../utils/ApiError";
import { IBreakdownItem } from "../types";

const FEATURE_PRICES: Record<string, number> = {
  booking: 25,
  contact_form: 10,
  live_chat: 30,
  newsletter: 15,
  gallery: 20,
  testimonials: 10,
  // ecommerce: 50, // TODO: Uncomment when eCommerce is implemented
};

export const calculate = async (projectId: string): Promise<IPricing> => {
  const project = await Project.findOne({ projectId })
    .populate("questionnaire")
    .populate("websiteSpec");
  if (!project) throw new ApiError(404, "Project not found");
  if (!project.questionnaire) throw new ApiError(400, "Complete questionnaire first");
  if (!project.websiteSpec) throw new ApiError(400, "Generate website first");

  const q = project.questionnaire as any;
  const spec = project.websiteSpec as any;

  const basePrice = 49;
  const pageCharge = (spec.pages?.length || 1) * 15;
  const featureCharge = (q.features || []).reduce(
    (sum: number, f: string) => sum + (FEATURE_PRICES[f] || 0),
    0
  );

  const allComponents = (spec.pages || []).flatMap((p: any) =>
    (p.sections || []).map((s: any) => s.component)
  );
  const premiumNames = ["Booking"];
  // TODO: Add "Ecommerce" back when eCommerce is implemented: ["Booking", "Ecommerce"]
  const premiumCount = allComponents.filter((c: string) =>
    premiumNames.some((p) => c.includes(p))
  ).length;
  const premiumComponentCharge = premiumCount * 20;

  const revisionCount = await Revision.countDocuments({ project: project._id });
  const freeRevisions = 2;
  const revisionCharge = Math.max(0, revisionCount - freeRevisions) * 5;

  const total = basePrice + pageCharge + featureCharge + premiumComponentCharge + revisionCharge;

  const breakdown: IBreakdownItem[] = [
    { label: "Base Package", amount: basePrice },
    { label: `${spec.pages?.length || 1} Pages`, amount: pageCharge },
    { label: "Features", amount: featureCharge },
    { label: "Premium Components", amount: premiumComponentCharge },
    { label: "Extra Revisions", amount: revisionCharge },
  ];

  const existing = await Pricing.findOne({ project: project._id });
  if (existing) {
    Object.assign(existing, {
      basePrice, pageCharge, featureCharge, premiumComponentCharge,
      revisionCharge, total, breakdown,
    });
    await existing.save();
    project.pricing = existing._id;
    project.status = "priced";
    await project.save();
    return existing;
  }

  const pricing = await Pricing.create({
    project: project._id,
    basePrice, pageCharge, featureCharge, premiumComponentCharge,
    revisionCharge, total, breakdown,
  });

  project.pricing = pricing._id;
  project.status = "priced";
  await project.save();

  return pricing;
};

export const get = async (projectId: string): Promise<IPricing | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Pricing.findOne({ project: project._id });
};
