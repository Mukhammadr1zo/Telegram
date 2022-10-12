import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const registerSchema = Joi.object({
  username: Joi.string().min(4).max(25).required(),
  email: Joi.string().email({ tlds: { allow: ['com', 'net', 'ru'] } }).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,100}$')).required()
});

export const messageSchema = Joi.object({
  
})
