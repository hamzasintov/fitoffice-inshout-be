import Joi from 'joi';

export const postSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0),
  password: Joi.string().min(3).max(16).required()
});

export const getSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  age: Joi.number().integer().min(0).optional(),
  email: Joi.string().min(3).max(16).email().optional()
});

export const patchSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  age: Joi.number().integer().min(0).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(3).max(16).optional()
}).or('name', 'age', 'email', 'password'); // Ensure at least one of these attributes is present
