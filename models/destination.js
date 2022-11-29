'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Destination.init({
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    image: DataTypes.STRING,
    total_aircraft: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Destination',
  });
  return Destination;
};