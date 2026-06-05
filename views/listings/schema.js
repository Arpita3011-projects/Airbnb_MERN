const Joi = require('joi');//joi is a validation library that allows us to validate the data that we receive from the client and it is very easy to use and it is very powerful and it allows us to create complex validation rules and it also allows us to create custom validation rules and it also allows us to create custom error messages and it also allows us to create custom validation schemas and it also allows us to create custom validation functions and it also allows us to create custom validation rules for arrays and objects and it also allows us to create custom validation rules for strings and numbers and it also allows us to create custom validation rules for dates and it also allows us to create custom validation rules for booleans and it also allows us to create custom validation rules for any type of data that we want to validate.

module.exports .listingSchema = Joi.object({
    listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
     country: Joi.string().required(),
     image: Joi.string().allow("",null)
    }).required()
});