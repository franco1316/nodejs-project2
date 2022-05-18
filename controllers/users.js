const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models/user");
const { Order } = require("../models/order");
const { Meal } = require("../models/meal");
const { Restaurant } = require("../models/restaurant");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

dotenv.config({ path: "./config.env" });

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, status } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newAccount = await User.create({
    name,
    email,
    password: hashPassword,
    role,
    status,
  });

  newAccount.password = undefined;

  res.status(201).json({ newAccount });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: "active" },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const updateProfileUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  //its weird, never will able to change their password, role or name
  await user.update({ name, email });

  res.status(200).json({ status: "success" });
});

const disableUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "disable" });

  res.status(200).json({
    status: "success",
  });
});

const getOrders = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const orders = await Order.findAll({
    where: {
      userId: token.id,
    },
    attributes: {
      exclude: ["id", "totalPrice", "quantity", "status"],
    },
  });

  const mealsOrder = await Meal.findAll({
    where: {
      id: orders.mealId,
    },
    attributes: {
      exclude: ["id", "restaurantId", "status"],
    },
  });

  const restaurantsOrder = await Restaurant.findAll({
    where: {
      id: mealsOrder.restaurantId,
    },
    attributes: {
      exclude: ["id", "rating", "status"],
    },
  });

  const ordersDetails = await orders.findAll({
    include: [{ mealsOrder }, { restaurantsOrder }],
  });

  res.status(200).json({
    ordersDetails,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(" ")[1];

  const order = await Order.findOne({
    where: {
      userId: token.id,
      id, //I suposed that the given id I have to use to find the specific order
    },
    attributes: {
      exclude: ["id", "totalPrice", "quantity", "status"],
    },
  });

  // get info of the meal

  const mealOrder = await Meal.findOne({
    where: {
      id: order.mealId,
    },
    attributes: {
      exclude: ["id", "restaurantId", "status"],
    },
  });

  //get info of the restaurant

  const restaurantOrder = await Restaurant.findOne({
    where: {
      id: mealOrder.restaurantId,
    },
    attributes: {
      exclude: ["id", "rating", "status"],
    },
  });

  //orden, meal order and restaurant where cook was ordered

  const orderDetails = await order.findOne({
    include: [{ mealOrder }, { restaurantOrder }],
  });

  res.status(200).json({
    orderDetails,
  });
});

module.exports = {
  createUser,
  getOrders,
  getOrderById,
  updateProfileUser,
  disableUser,
  login,
};
