"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking_detail.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
    }
  }
  Booking_detail.init(
    {
      transaction_id: DataTypes.INTEGER,
      nik: DataTypes.STRING,
      passenger_name: DataTypes.STRING,
      passenger_phone: DataTypes.STRING,
      seat_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking_detail",
    }
  );
  return Booking_detail;
};
