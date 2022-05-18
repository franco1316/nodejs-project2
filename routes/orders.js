const express = require("express");

const {
  checkValidations,
  createOrderValidations,
} = require("../middlewares/validations");

const {
  orderExist,
  userExist,
  orderOwnerUser,
} = require("../middlewares/orders");

const {
  createOrder,
  getAllOrders,
  completeOrder,
  cancelledOrder,
} = require("../controllers/orders");

const router = express.Router();

router.post(
  "/",
  userExist,
  createOrderValidations,
  checkValidations,
  createOrder
);
router.get("/me", userExist, getAllOrders);

router
  .route(":id")
  .patch(orderExist, orderOwnerUser, completeOrder)
  .delete(orderExist, orderOwnerUser, cancelledOrder);

module.exports = { orders: router };
