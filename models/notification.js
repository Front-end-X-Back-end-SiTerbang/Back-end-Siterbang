"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notification.belongsTo(models.Transaction, {
      //   foreignKey: "transaction_id",
      //   as: "transaction",
      // });
    }
  }
  Notification.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
