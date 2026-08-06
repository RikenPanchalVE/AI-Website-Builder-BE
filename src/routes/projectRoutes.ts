import { Router } from "express";
import * as projectController from "../controllers/projectController";
import * as questionnaireController from "../controllers/questionnaireController";
import validate from "../middlewares/validate";
import { createProject, updateStatus, saveQuestionnaire } from "../validators/projectValidator";

const router = Router();

router.post("/", validate(createProject), projectController.createProject);
router.get("/:projectId", projectController.getProject);
router.patch("/:projectId/status", validate(updateStatus), projectController.updateProjectStatus);

router.post("/:projectId/questionnaire", validate(saveQuestionnaire), questionnaireController.saveQuestionnaire);
router.get("/:projectId/questionnaire", questionnaireController.getQuestionnaire);
router.put("/:projectId/questionnaire", validate(saveQuestionnaire), questionnaireController.updateQuestionnaire);

export default router;
