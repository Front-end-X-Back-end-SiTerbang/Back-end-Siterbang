"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      origin_id: {
        type: Sequelize.INTEGER,
      },
      destination_id: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      transit_total: {
        type: Sequelize.INTEGER,
      },
      flight_date: {
        type: Sequelize.STRING,
      },
      depature_hours: {
        type: Sequelize.TIME,
      },
      airline_id: {
        type: Sequelize.INTEGER,
      },
      airplane_id: {
        type: Sequelize.INTEGER,
      },
      estimation: {
        type: Sequelize.FLOAT,
      },
      code: {
        type: Sequelize.STRING,
      },
      gate: {
        type: Sequelize.STRING,
      },
      terminal: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      created_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
