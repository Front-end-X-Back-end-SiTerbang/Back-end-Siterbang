'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    product_id: DataTypes.INTEGER,
    airline_id: DataTypes.INTEGER,
    aircraft_id: DataTypes.INTEGER,
    is_paid: DataTypes.BOOLEAN,
    is_cancelled: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    total_order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};