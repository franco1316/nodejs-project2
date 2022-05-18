const { Restaurant } = require("../models/restaurant");
const { Review } = require("../models/review");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const createNewRestaurant = catchAsync(async (req, res, next) => {
  const { name, adress, rating, status } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    adress,
    rating,
    status,
  });

  res.status(201).json({ newRestaurant });
});

const getAllRestaurants = catchAsync(async (req, res, next) => {
  const allRestaurants = await Restaurant.findAll({
    where: {
      status: "active",
    },
    exclude: ["id"],
  });

  res.status(200).json({ allRestaurants });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  // I just only search for exlude the id of restaurant in res.json()
  const foundRestaurant = await restaurant.findOne({
    exclude: ["id"],
  });

  res.status(200).json({ foundRestaurant });

  //This would be a faster way
  //res.status(200).json({ req.restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, adress } = req.body;

  await restaurant.update({ name, adress });

  res.status(200).json({
    status: "success",
  });
});

const disableRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: "disable" });

  res.status(200).json({
    status: "success",
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;

  const newReview = await Review.create({
    comment,
    rating,
    restaurantId: id,
  });

  res.status(201).json({ newReview });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  const review = await Review.findOne({
    where: {
      restaurantId: id,
    },
  });

  await review.update({
    comment,
    rating,
  });

  res.status(200).json({
    status: "success",
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({
    where: {
      restaurantId: id,
    },
  });

  await review.update({
    status: "deleted",
  });

  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  createNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  disableRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
