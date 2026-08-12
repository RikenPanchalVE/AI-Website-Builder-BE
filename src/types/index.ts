import { Request, Response, NextFunction } from "express";
import { Document, Types } from "mongoose";

export interface IEnquiry {
  fullName: string;
  email: string;
  phone?: string;
  businessName: string;
  // Chosen in the questionnaire's Business step, not on the landing page —
  // may be absent at project-creation time.
  businessType?: string;
}

export interface IProject extends Document {
  _id: Types.ObjectId;
  projectId: string;
  name: string;
  status: ProjectStatus;
  enquiry?: IEnquiry;
  questionnaire?: Types.ObjectId;
  assets: Types.ObjectId[];
  websiteSpec?: Types.ObjectId;
  theme?: Types.ObjectId;
  revisions: Types.ObjectId[];
  pricing?: Types.ObjectId;
  payment?: Types.ObjectId;
  publishedSite?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus =
  | "created"
  | "questionnaire_complete"
  | "assets_uploaded"
  | "generating"
  | "generated"
  | "revision"
  | "approved"
  | "priced"
  | "paid"
  | "published";

export type PageSlug =
  | "home"
  | "about"
  | "services"
  | "service_details"
  | "portfolio"
  | "portfolio_details"
  | "pricing"
  | "blog"
  | "blog_details"
  | "contact"
  | "faq"
  | "testimonials";

export type Feature =
  | "booking"
  | "contact_form"
  | "live_chat"
  | "newsletter"
  | "gallery"
  | "testimonials";
  // | "ecommerce"; // TODO: Uncomment when eCommerce is implemented

export type ThemeStyle = "modern" | "corporate" | "minimal" | "luxury" | "creative";

export type BorderRadius = "none" | "small" | "medium" | "large";
export type Spacing = "compact" | "normal" | "relaxed";
export type ButtonStyle = "rounded" | "square" | "pill";

export type AssetType = "logo" | "image" | "pdf" | "docx" | "txt";

export type RevisionStatus = "pending" | "applied" | "rejected";
export type PaymentStatus = "pending" | "completed" | "failed";

export interface ISection {
  id: string;
  component: string;
  props: Record<string, unknown>;
  order: number;
}

export interface IPage {
  slug: string;
  title: string;
  sections: ISection[];
}

export interface IBreakdownItem {
  label: string;
  amount: number;
}

export interface IQuestionnaire {
  answers: Record<string, any>;
  completedAt?: Date;
}

export interface TypedRequest extends Request {
  body: Record<string, unknown>;
  params: Record<string, string>;
}

export type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
