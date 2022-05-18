const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { globalErrorHandler } = require("./controllers/errors");

const { users } = require("./routes/users");
const { orders } = require("./routes/orders");
const { meals } = require("./routes/meals");
const { restaurants } = require("./routes/restaurants");

const app = express();

app.use(cors());

app.use(express.json());

const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000,
  message: "Too many requests from this IP",
});

app.use(limiter);

app.use("/api/v1/users", users);
app.use("api/v1/orders", orders);
app.use("/api/v1/meals", meals);
app.use("/api/v1/restaurants", restaurants);

app.use("*", globalErrorHandler);

module.exports = { app };
