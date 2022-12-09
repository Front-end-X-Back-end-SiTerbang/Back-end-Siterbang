"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Payment, {
        foreignKey: "user_id",
        as: "payments",
      });
      User.hasMany(models.Transaction, {
        foreignKey: "user_id",
        as: "transactions",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      emailToken: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      address: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      photo: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      user_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
