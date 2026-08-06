import Joi from "joi";

export const createProject = {
  body: Joi.object({
    fullName: Joi.string().min(1).max(200).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).allow("", null).optional(),
    businessName: Joi.string().min(1).max(200).required(),
    businessType: Joi.string().min(1).max(200).required(),
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
