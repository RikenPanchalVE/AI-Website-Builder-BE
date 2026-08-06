import Project, { IProject } from "../models/Project";
import "../models/Questionnaire";
import "../models/Asset";
import "../models/Theme";
import "../models/WebsiteSpecification";
import "../models/Revision";
import "../models/Pricing";
import "../models/Payment";
import "../models/PublishedSite";

export const create = async (data: Partial<IProject>): Promise<IProject> => {
  return Project.create(data);
};

export const findById = async (projectId: string): Promise<IProject | null> => {
  return Project.findOne({ projectId })
    .populate("questionnaire")
    .populate("assets")
    .populate("websiteSpec")
    .populate("theme")
    .populate("revisions")
    .populate("pricing")
    .populate("payment")
    .populate("publishedSite");
};

export const updateStatus = async (
  projectId: string,
  status: string
): Promise<IProject | null> => {
  return Project.findOneAndUpdate({ projectId }, { status }, { new: true });
};

export const update = async (
  projectId: string,
  data: Partial<IProject>
): Promise<IProject | null> => {
  return Project.findOneAndUpdate({ projectId }, data, { new: true });
};
