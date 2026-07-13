const Joi = require('joi');

module.exports.validateListingBody = (body) => {
  const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
  });

  return listingSchema.validate(body);
};

module.exports.validateReviewBody = (body) => {
  const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  });

  return reviewSchema.validate(body);
};

