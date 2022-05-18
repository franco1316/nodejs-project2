const express = require("express");
const router = express.Router();

const { authenticate, protectAdmin } = require("../middlewares/meals");

const {
  createMealValidation,
  checkValidations,
} = require("../middlewares/validations");

const {
  getAllActiveMeals,
  getActiveMealById,
  newMeal,
  updateMeal,
  disableMeal,
} = require("../controllers/meals");

router.get("/", getAllActiveMeals);

router
  .route("/:id")
  .get(getActiveMealById)
  .post(authenticate, createMealValidation, checkValidations, newMeal)
  .patch(authenticate, protectAdmin, updateMeal)
  .delete(authenticate, protectAdmin, disableMeal);

module.exports = { meals: router };
