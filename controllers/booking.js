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
          data: airports,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Success get booking details",
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  },
  createBooking: async (req, res, next) => {
    try {
        const { transaction_id } = req.params;
        const { passenger_name, passenger_phone, seat_number } = req.body;    
        
        const newBooking = await Booking_detail.create({
          transaction_id,
          passenger_name,
          passenger_phone,
          seat_number,
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