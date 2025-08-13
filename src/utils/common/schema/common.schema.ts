import Joi from 'joi';

export const passport_schema = Joi.array().items(
  Joi.object({
    passport_id: Joi.number().integer().required(),
    amount: Joi.number().required(),
  })
);

export const tread_schema = Joi.array().items(
  Joi.object({
    work_id: Joi.number().integer().required(),
    amount: Joi.number().required(),
  })
);

export const companyTreadSchema = Joi.array().items(
  Joi.object({
    work_type_id: Joi.number().integer().required(),
    work_quantity: Joi.number().integer().required(),
    work_unit_price: Joi.number().required(),
  })
    .min(1)
    .required()
);
