"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin SiTerbang",
          email: "ofc.siterbang@gmail.com",
          password: "admin",
          phone: "085155106038",
          address: "Purwokerto",
          postal_code: 53192,
          photo: "admin.jpg",
          user_type: "BASIC",
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
