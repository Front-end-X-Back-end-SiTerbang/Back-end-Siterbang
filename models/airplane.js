"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airplane.belongsTo(models.Airline, {
        foreignKey: "airline_id",
        as: "airline",
      });
      Airplane.belongsTo(models.Destination, {
        foreignKey: "destination_id",
        as: "destinations",
      });
      Airplane.hasMany(models.Product, {
        foreignKey: "airplane_id",
        as: "products",
      });
    }
  }
  Airplane.init(
    {
      name: DataTypes.STRING,
      airline_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      destination_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Airplane",
    }
  );
  return Airplane;
};
