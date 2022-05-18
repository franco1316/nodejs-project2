const { Order } = require("../models/order");
const { User } = require("../models/user");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const orderExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { mealId, userId } = req.body;

  const order = await Order.findOne({
    where: { id, userId, mealId, status: "active" },
    attributes: { exclude: ["mealId", "userId"] },
  });

  if (!order) {
    return next(new AppError("Order does not exist with given Id", 404));
  }

  req.order = order;
  next();
});

const userExist = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findOne({
    where: { id: userId, status: "active" },
    attributes: { exclude: ["password"] },
  });

  if (!id) {
    return next(new AppError("User does not exist with given Id", 404));
  }

  req.user = user;
  next();
});

const orderOwnerUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const thisOrder = await Order.findOne({
    where: { id },
  });

  const ownerUser = await User.findOne({
    where: {
      id: thisOrder.userId,
    },
  });

  if (!ownerUser) {
    return next(new AppError("You cant modified this order"));
  }

  next();
});

module.exports = {
  orderExist,
  userExist,
  orderOwnerUser,
};
