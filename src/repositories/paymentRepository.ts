import Payment, { IPayment } from "../models/Payment";
import Project from "../models/Project";
import Pricing from "../models/Pricing";
import ApiError from "../utils/ApiError";
import { v4 as uuidv4 } from "uuid";

export const process = async (projectId: string): Promise<IPayment> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  if (!project.pricing) throw new ApiError(400, "Calculate pricing first");

  const pricing = await Pricing.findById(project.pricing);
  if (!pricing) throw new ApiError(404, "Pricing not found");

  const payment = await Payment.create({
    project: project._id,
    pricing: pricing._id,
    amount: pricing.total,
    method: "mock_card",
    status: "completed",
    transactionId: uuidv4(),
    paidAt: new Date(),
  });

  project.payment = payment._id;
  project.status = "paid";
  await project.save();

  return payment;
};

export const get = async (projectId: string): Promise<IPayment | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return Payment.findOne({ project: project._id });
};
