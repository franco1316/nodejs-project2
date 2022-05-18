const { Review } = require("../models/review");
const { User } = require("../models/user");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

//I think in include authenticate in utils
const authenticate = catchAsync(async (req, res, next) => {
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

const userAdmin = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  const review = await Review.findOne({
    where: {
      restaurantId: restaurant.id,
    },
  });

  const user = await User.findOne({
    where: {
      id: review.userId,
    },
  });

  if (user.role !== "admin") {
    return next(new AppError("Cannot able to realize this action"));
  }
});

const validationRating = catchAsync(async (req, res, next) => {
  const { rating } = req.body;
  if (rating < 1 || rating > 5) {
    return next(new AppError("Rating value is invalid"));
  }
  next();
});

module.exports = {
  authenticate,
  userAdmin,
  createValidations,
  validationRating,
};
