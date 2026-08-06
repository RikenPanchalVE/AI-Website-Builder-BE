import { Router } from "express";
import * as pricingController from "../controllers/pricingController";
import * as paymentController from "../controllers/paymentController";
import * as publishController from "../controllers/publishController";

const router = Router();

router.post("/:projectId/pricing/calculate", pricingController.calculate);
router.get("/:projectId/pricing", pricingController.get);

router.post("/:projectId/payment/process", paymentController.process);
router.get("/:projectId/payment", paymentController.get);

router.post("/:projectId/publish", publishController.publish);
router.get("/:projectId/published-site", publishController.get);

export default router;
