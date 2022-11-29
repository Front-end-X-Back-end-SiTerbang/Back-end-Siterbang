'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aircraft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Aircraft.init({
    name: DataTypes.STRING,
    airline_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    destination_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Aircraft',
  });
  return Aircraft;
};