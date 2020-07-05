const Joi = require('@hapi/joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(5)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('password', 'repeat_password');  //both od them should be identical

module.exports = schema;