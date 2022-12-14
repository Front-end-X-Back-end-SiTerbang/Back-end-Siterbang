"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Airline, {
        foreignKey: "airline_id",
        as: "airline",
      });
      Product.hasMany(models.Transaction, {
        foreignKey: "product_id",
        as: "transactions",
      });
      Product.belongsTo(models.Airport, {
        foreignKey: "destination_id",
        as: "destination",
      });
      Product.belongsTo(models.Airport, {
        foreignKey: "origin_id",
        as: "origin",
      });
      Product.belongsTo(models.Airplane, {
        foreignKey: "airplane_id",
        as: "airplane",
      });
    }
  }
  Product.init(
    {
      origin_id: DataTypes.INTEGER,
      destination_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      transit_total: DataTypes.INTEGER,
      flight_date: DataTypes.STRING,
      depature_hours: DataTypes.TIME,
      airline_id: DataTypes.INTEGER,
      airplane_id: DataTypes.INTEGER,
      estimation: DataTypes.FLOAT,
      code: DataTypes.STRING,
      gate: DataTypes.STRING,
      terminal: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      createdAt: "created_date",
      modelName: "Product",
    }
  );
  return Product;
};
