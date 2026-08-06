import * as paymentRepo from "../repositories/paymentRepository";
import { IPayment } from "../models/Payment";

export const processPayment = async (projectId: string): Promise<IPayment> => {
  return paymentRepo.process(projectId);
};

export const getPayment = async (projectId: string): Promise<IPayment | null> => {
  return paymentRepo.get(projectId);
};
