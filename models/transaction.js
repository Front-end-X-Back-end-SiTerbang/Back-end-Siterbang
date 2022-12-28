"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Transaction.hasMany(models.Booking_detail, {
        foreignKey: "transaction_id",
        as: "booking_details",
      });
      Transaction.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      // Transaction.hasMany(models.Notification, {
      //   foreignKey: "transaction_id",
      //   as: "notification",
      // });
    }
  }
  Transaction.init(
    {
      product_id: DataTypes.INTEGER,
      is_paid: DataTypes.BOOLEAN,
      is_cancelled: DataTypes.BOOLEAN,
      user_id: DataTypes.INTEGER,
      total_order: DataTypes.INTEGER,
      total_passenger: DataTypes.INTEGER,
      is_read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
