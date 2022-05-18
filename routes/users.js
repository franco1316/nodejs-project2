const express = require("express");

const {
  createUserValidations,
  checkValidations,
} = require("../middlewares/validations");

const {
  protectToken,
  userExists,
  protectAccountOwner,
} = require("../middlewares/users");

const {
  createUser,
  login,
  getOrders,
  getOrderById,
  updateProfileUser,
  disableUser,
} = require("../controllers/users");

const router = express.Router();

router.post("/signup", createUserValidations, checkValidations, createUser);

router.post("/login", login);

router.get("/orders", userExists, protectToken, getOrders);

router.get(
  "/orders/:id",
  userExists,
  protectToken,
  protectAccountOwner,
  getOrderById
);

router
  .route("/:id")
  .patch(userExists, protectToken, protectAccountOwner, updateProfileUser)
  .delete(userExists, protectToken, protectAccountOwner, disableUser);

module.exports = { users: router };
