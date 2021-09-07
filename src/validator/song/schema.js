const Joi = require('joi');

const songSchemaPayload = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number().required(),
});

module.exports = songSchemaPayload;