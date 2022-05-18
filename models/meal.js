const { DataTypes } = require("sequelize");
const { db } = require("../utils/database");

const Meal = db.define("meal", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING,
  },
});

module.exports = { Meal };
