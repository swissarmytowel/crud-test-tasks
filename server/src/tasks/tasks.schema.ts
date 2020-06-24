import * as Joi from '@hapi/joi';

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .max(50)
    .pattern(new RegExp(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/))
    .required(),

  duration: Joi.number()
    .integer()
    .greater(0)
    .positive()
    .required(),

  date: Joi.date()
    .timestamp()
    .optional()
});
