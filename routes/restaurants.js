const express = require("express");

const {
  createReviewValidations,
  createRestaurantValidations,
  checkValidations,
} = require("../middlewares/validations");

const {
  authenticate,
  createValidations,
  userAdmin,
  validationRating,
} = require("../middlewares/restaurants");

const {
  createNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  disableRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/restaurants");

const router = express.Router();

router
  .route("/")
  .get(getAllRestaurants)
  .post(
    authenticate,
    userAdmin,
    createRestaurantValidations,
    checkValidations,
    validationRating,
    createNewRestaurant
  );

router
  .route("/reviews/:id")
  .post(
    authenticate,
    validationRating,
    createReviewValidations,
    checkValidations,
    createReview
  )
  .patch(authenticate, validationRating, updateReview)
  .delete(authenticate, deleteReview);

router
  .route("/:id")
  .get(getRestaurantById)
  .patch(userAdmin, updateRestaurant)
  .delete(userAdmin, disableRestaurant);

module.exports = { restaurants: router };
