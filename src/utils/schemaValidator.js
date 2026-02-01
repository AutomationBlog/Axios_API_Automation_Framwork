const Joi = require('joi');

class SchemaValidator {
  static validateResponse(data, schema) {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new Error(`Schema validation failed: ${errorMessages.join(', ')}`);
    }

    return value;
  }

  static assertSchema(data, schema) {
    try {
      this.validateResponse(data, schema);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

// Common schemas
const schemas = {
  user: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.object({
      street: Joi.string(),
      suite: Joi.string(),
      city: Joi.string(),
      zipcode: Joi.string(),
      geo: Joi.object({
        lat: Joi.string(),
        lng: Joi.string()
      })
    }),
    phone: Joi.string(),
    website: Joi.string(),
    company: Joi.object({
      name: Joi.string(),
      catchPhrase: Joi.string(),
      bs: Joi.string()
    })
  }),

  post: Joi.object({
    userId: Joi.number().required(),
    id: Joi.number().required(),
    title: Joi.string().required(),
    body: Joi.string().required()
  }),

  comment: Joi.object({
    postId: Joi.number().required(),
    id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    body: Joi.string().required()
  }),

  errorResponse: Joi.object({
    message: Joi.string(),
    error: Joi.string(),
    statusCode: Joi.number()
  })
};

module.exports = { SchemaValidator, schemas };
