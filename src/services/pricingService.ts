import * as pricingRepo from "../repositories/pricingRepository";
import { IPricing } from "../models/Pricing";

export const calculatePricing = async (projectId: string): Promise<IPricing> => {
  return pricingRepo.calculate(projectId);
};

export const getPricing = async (projectId: string): Promise<IPricing | null> => {
  return pricingRepo.get(projectId);
};
