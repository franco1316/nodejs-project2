const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");

const { User } = require("../models/user");

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

const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== "admin") {
    return next(new AppError("Access not granted", 403));
  }

  next();
});

module.exports = { authenticate, protectAdmin };
