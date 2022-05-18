const { Meal } = require("../models/meal");
const { Restaurant } = require("../models/restaurant");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const getAllActiveMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
      status: "active",
    },
    exclude: ["id", "restaurantId"],
  });

  let mealsPlus = [];

  for (let i = 0; i < meals.length; i++) {
    const restaurant = await Restaurant.findOne({
      where: {
        id: meals[i].id,
      },
    });
    if (restaurant) {
      const mealPlus = await meals.findOne({
        include: [{ restaurant }],
      });
      mealsPlus[mealsPlus.length] = mealPlus;
    }
  }

  res.status(200).json({ mealsPlus });
});

const getActiveMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = Meal.findOne({
    where: {
      id,
      status: "active",
    },
  });

  const restaurant = await Restaurant.findOne({
    where: {
      id: meal.restaurantId,
    },
    exclude: ["id"],
  });

  const foundMeal = await meal.findOne({
    where: { status: "active" },
    exclude: ["id", "restaurantId"],
    include: [{ restaurant }],
  });

  res.status(200).json({
    foundMeal,
  });
});

const newMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const meal = await Meal.create({ name, price, restaurantId: id });

  const thisMeal = await meal.findOne({
    exclude: ["id", "restaurantId"],
  });

  res.status(201).json({
    thisMeal,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  res.status(200).json({
    status: "success",
  });
});

const disableMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: "disable" });

  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  getAllActiveMeals,
  getActiveMealById,
  newMeal,
  updateMeal,
  disableMeal,
};
