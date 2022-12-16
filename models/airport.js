"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airport.hasMany(models.Product, {
        foreignKey: "destination_id",
        as: "arrival_products",
      });
      Airport.hasMany(models.Product, {
        foreignKey: "origin_id",
        as: "depature_products",
      });
    }
  }
  Airport.init(
    {
      iata_code: DataTypes.STRING,
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Airport",
    }
  );
  return Airport;
};
