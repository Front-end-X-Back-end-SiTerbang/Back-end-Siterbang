const { Booking_detail } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  get: async (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      const booking = await Booking_detail.findOne({
        where: { transaction_id },
      });

      if (!booking) {
        return res.status(404).json({
          status: false,
          message: "Transaction Id not found",
          data: booking,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Success get booking details",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },
  createBooking: async (req, res, next) => {
    try {
        const { transaction_id } = req.params;
        const { nik, passenger_name, passenger_phone} = req.body;
        
        const max = 200;
        const seat = Math.floor((Math.random() * max) + 1);

        const newBooking = await Booking_detail.create({
          nik,
          transaction_id,
          passenger_name,
          passenger_phone,
          seat_number:seat,
        }); 
        return res.status(201).json({
          status: true,
          message: "Booking successfully!",
          data: newBooking,
        });
    }   catch (error) {
        next(error);
    }
  },
};