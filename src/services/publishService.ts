import * as publishedSiteRepo from "../repositories/publishedSiteRepository";
import { IPublishedSite } from "../models/PublishedSite";

export const publishSite = async (projectId: string): Promise<IPublishedSite> => {
  return publishedSiteRepo.publish(projectId);
};

export const getPublishedSite = async (projectId: string): Promise<IPublishedSite | null> => {
  return publishedSiteRepo.get(projectId);
};
