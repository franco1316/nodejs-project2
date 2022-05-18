const { Restaurant } = require("./restaurant");
const { Meal } = require("./meal");

const { Review } = require("./review");
const { User } = require("./user");

const { Order } = require("./order");

const initModels = () => {
  Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
  Meal.belongsTo(Restaurant, { foreignKey: "id" });

  Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
  Review.belongsTo(Restaurant, { foreignKey: "id" });

  Review.hasOne(User, { foreignKey: "id" });
  User.belongsToMany(Review, { foreignKey: "userId" });

  Order.hasOne(Meal, { foreignKey: "id" });
  Meal.belongsTo(Order, { foreignKey: "mealId" });

  Order.hasOne(User, { foreignKey: "id" });
  User.belongsTo(Order, { foreignKey: "userId" });
};

module.exports = { initModels };
