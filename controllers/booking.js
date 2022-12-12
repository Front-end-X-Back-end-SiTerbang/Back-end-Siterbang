const { Booking_detail, Transaction } = require("../models");
const { Op } = require("sequelize");
const { FLIGHT_CLASS } = require("../utils/enum");

module.exports = {
  get: async (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      const booking = await Booking_detail.findAll({
        where: { transaction_id },
      });
      const transactionExist = await Transaction.findOne({
        where: { id: transaction_id },
      });
      if (!transactionExist) {
        return res.status(200).json({
          status: false,
          message: "transaction not found",
          data: transactionExist,
        });
      }
      if (!booking.length) {
        return res.status(404).json({
          status: false,
          message: "Passenger data has not been filled",
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
      const { nik, passenger_name, passenger_phone } = req.body;

      const transactionExist = await Transaction.findOne({
        where: { id: transaction_id },
        include: ["product"],
      });
      const detailsCount = await Booking_detail.count({
        where: { transaction_id: transaction_id },
      });

      if (!transactionExist) {
        return res.status(200).json({
          status: false,
          message: "transaction not found",
          data: transactionExist,
        });
      }

      if (detailsCount >= transactionExist.total_passenger) {
        return res.status(400).json({
          status: false,
          message: "Passenger data has been filled",
        });
      }

      const max = 200;
      const seatNum = Math.floor(Math.random() * max + 1);
      const seatCode = ["E", "B", "F"];
      const productType = transactionExist.product.type;
      let seat = "seat";
      if (productType == FLIGHT_CLASS.ECONOMY) {
        seat = seatCode[0] + String(seatNum);
      } else if (productType == FLIGHT_CLASS.BUSINESS) {
        seat = seatCode[1] + String(seatNum);
      } else if (productType == FLIGHT_CLASS.FIRST) {
        seat = seatCode[2] + String(seatNum);
      } else {
        return res.status(400).json({
          status: false,
          message: "Incorrect Flight Class",
        });
      }

      const newBooking = await Booking_detail.create({
        nik,
        transaction_id,
        passenger_name,
        passenger_phone,
        seat_number: seat,
      });
      return res.status(201).json({
        status: true,
        message: "Passenger Data Added",
        data: newBooking,
      });
    } catch (error) {
      next(error);
    }
  },
  count: async (req, res, next) => {
    try {
      const count = await Booking_detail.count();
      return res.status(200).json({
        status: true,
        message: "success count passengers data",
        data: count,
      });
    } catch (error) {
      next(error);
    }
  },
};
