const { body, validationResult } = require("express-validator");

const { AppError } = require("../utils/appError");

const createUserValidations = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .if(body("role") !== "normal" || "admin")
    .withMessage("User is not a valid user"),
  body("status").isString().withMessage("Status must be a string"),
];

const createOrderValidations = [
  body("totalPrice")
    .notEmpty()
    .withMessage("Totalprice cannot be empty")
    .isString()
    .withMessage("TotalPrice must be a string"),
  body("quantity").isInt().withMessage("Quantity must be an Integer"),
  body("status")
    .if(body("status") !== "active" || "cancelled" || "completed")
    .withMessage("Order has a invalid value"),
];

const createRestaurantValidations = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("adress").notEmpty().withMessage("Adress cannot be empty"),
  body("rating")
    .notEmpty()
    .withMessage("Rating cannot be empty")
    .isInt()
    .withMessage("Rating must be an integer value"),
  body("status").isString().withMessage("Status must be a string"),
];

const createReviewValidations = [
  body("comment").isString().withMessage("Comment must be a string"),
  body("rating").isInt().withMessage("Rating must be an integer"),
];

const createMealValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isInt()
    .withMessage("Price must be an integer"),
  body("status").isString().withMessage("Status must be a string"),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    const errorMsg = messages.join(". ");

    return next(new AppError(errorMsg, 400));
  }

  next();
};
module.exports = {
  createUserValidations,
  createOrderValidations,
  createRestaurantValidations,
  createReviewValidations,
  createMealValidation,
  checkValidations,
};
