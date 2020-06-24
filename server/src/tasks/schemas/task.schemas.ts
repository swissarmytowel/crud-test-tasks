import * as Joi from '@hapi/joi';

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .max(50)
    .pattern(new RegExp(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/))
    .required(),

  duration: Joi.number()
    .integer()
    .greater(0)
    .required(),

  date: Joi.date()
    .iso()
    .optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string()
    .max(50)
    .pattern(new RegExp(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/))
    .optional(),

  duration: Joi.number()
    .greater(0)
    .optional(),

  date: Joi.date()
    .iso()
    .optional()
});
