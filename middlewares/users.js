const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Session invalid", 403));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  });

  if (!user) {
    return next(
      new AppError("The owner of this token is no longer available", 403)
    );
  }

  req.sessionUser = user;
  next();
});

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  //mainly is get the user and verify your status like active
  const user = await User.findOne({
    where: { id, status: "active" },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return next(new AppError("User does not exist with given Id", 404));
  }

  req.user = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req;

  //mainly is compare the id of user of the account and user attempt access should be the same id
  if (sessionUser.id !== user.id) {
    return next(new AppError("You do not own this account", 403));
  }

  next();
});

module.exports = {
  userExists,
  protectToken,
  protectAccountOwner,
};
