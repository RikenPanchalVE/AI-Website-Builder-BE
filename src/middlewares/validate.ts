import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validate = (schema: { body?: Joi.ObjectSchema }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validator = schema.body || schema as unknown as Joi.ObjectSchema;
    const { error } = validator.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
      return;
    }
    next();
  };
};

export default validate;
