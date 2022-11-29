'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    origin: DataTypes.STRING,
    destination_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    transit_total: DataTypes.INTEGER,
    flight_date: DataTypes.DATE,
    airline_id: DataTypes.INTEGER,
    aircraft_id: DataTypes.INTEGER,
    estimation: DataTypes.TIME,
    created_date: DataTypes.DATE,
    code: DataTypes.STRING,
    gate: DataTypes.STRING,
    terminal: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};