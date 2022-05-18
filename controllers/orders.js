const dotenv = require("dotenv");

const { Order } = require("../models/order");
const { Meal } = require("../models/meal");
const { Restaurant } = require("../models/restaurant");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

dotenv.config({ path: "./config.env" });

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;

  //search meal for get the price
  const meal = await Meal.findOne({
    where: {
      id: mealId,
    },
  });

  if (!meal) {
    return next(new AppError("Error order cant create"));
  }

  const priceOrder = meal.price * quantity;

  const newOrder = await Order.create({
    totalPrice: priceOrder,
    mealId,
    quantity,
  });

  res.status(201).json({ newOrder });
});

const getAllOrders = catchAsync(async (req, res, next) => {

  const orders = getInfoModel(Order,'active')

  let mealsPlus = [];
  mealsPlus = addInfoModel(Meal, orders, ordersPlus, 'mealId', 'meal')

  const meals = getInfoModel(Meal)

  let restaurantsPlus = [];
  restaurantsPlus = addInfoModel(Restaurant, meals, restaurantsPlus, 'restaurantId', 'restaurant')

  const allOrders = mergeInfoModel(orders, mealsPlus, restaurantsPlus)

  res.status(200).json({ allOrders });
});

const completeOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  const { id } = req.params;

  if (order.status !== "active") {
    return next(new AppError("Order invalid", 400));
  }
  if (order.id === id) {
    await order.update({
      status: "completed",
    });
  }

  res.status(200).json({ status: "success" });
});

const cancelledOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  const { id } = req.params;

  //i think in do this like a middleware but i have not enough time
  if (order.status !== "active") {
    return next(new AppError("Order invalid", 400));
  }
  if (order.id === id) {
    await order.update({
      status: "disable",
    });
  }

  res.status(200).json({
    status: "success",
  });
});

function getInfoModel(model,value){
  if(value){
  return info = await model.findAll({
    where: { status: `${value}` },
  });
  }
  return info = await model.findAll();
}

function addInfoModel(fromModel, fromInfo, infoPlus, fromInfoId, toModelInfo){
  for (let i = 0; i < fromInfo.length; i++) {
    const moreInfo = await fromModel.findOne({
      where: {
        id: fromInfo[i][`${fromInfoId}`],
      },
    });
    if (moreInfo) {
      const plus = await fromInfo.findOne({
        include: [{ [`${toModelInfo}`] : moreInfo }],
      });
      infoPlus[infoPlus.length] = plus;
    }
  }
  return infoPlus;
}

function mergeInfoModel(allInfo, plus1, plus2){
  return await allInfo.findAll({
    include: [{ plus1 }, { plus2 }],
  });
}

module.exports = {
  createOrder,
  getAllOrders,
  completeOrder,
  cancelledOrder,
  addInfoModel,
};
