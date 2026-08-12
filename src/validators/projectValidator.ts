import Joi from "joi";

export const createProject = {
  body: Joi.object({
    fullName: Joi.string().min(1).max(200).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).allow("", null).optional(),
    businessName: Joi.string().min(1).max(200).required(),
    // Chosen in the questionnaire's first step instead of on the landing
    // page, so it's optional at project-creation time.
    businessType: Joi.string().max(200).allow("", null).optional(),
  }),
};

export const updateStatus = {
  body: Joi.object({
    status: Joi.string()
      .valid(
        "created", "questionnaire_complete", "assets_uploaded",
        "generating", "generated", "revision", "approved",
        "priced", "paid", "published"
      )
      .required(),
  }),
};

export const saveQuestionnaire = {
  body: Joi.object({
    answers: Joi.object().required(),
  }).unknown(true),
};
