const { Payment } = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const payments = await Payment.findAll();

      if (!payments.length) {
        return res.status(200).json({
          status: false,
          message: "No Payment method found",
          data: payments,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all user payment method data",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },
  createPayment: async (req, res, next) => {
    try {
      const { number, name, type } = req.body;
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);

      //check payment
      const paymentExist = await Payment.findOne({ where: { number } });
      if (paymentExist) {
        return res.status(409).json({
          status: false,
          message: "This payment method already used!",
          data: null,
        });
      }

      const newPayment = await Payment.create({
        number,
        name,
        type,
        user_id: user.id,
        balance: 0,
      });

      return res.status(201).json({
        status: true,
        message: "Payment method added successfully!",
        data: newPayment,
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payments = await Payment.findOne({
        where: { id },
      });

      if (!payments) {
        return res.status(200).json({
          status: false,
          message: "No payment method found",
          data: payments,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get payment method",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },
  topUp: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { balance } = req.body;
      const paymentExist = await Payment.findOne({ where: { id } });
      if (!paymentExist) {
        return res.status(200).json({
          status: false,
          message: "Payment Method not found",
          data: paymentExist,
        });
      }
      const newBalance = paymentExist.balance + balance;
      const topUp = await Payment.update(
        { balance: newBalance },
        { where: { id } }
      );
      const updated = await Payment.findOne({ where: { id } });
      return res.status(200).json({
        status: true,
        message: "Top Up Success",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { number, type, name } = req.body;
      const { id } = req.params;

      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);

      const paymentExist = await Payment.findOne({ where: { id } });
      if (!paymentExist) {
        return res.status(200).json({
          status: false,
          message: "Payment method not found",
          data: paymentExist,
        });
      }
      if (paymentExist.number == number) {
        return res.status(409).json({
          status: false,
          message: "This payment method already used",
          data: paymentExist,
        });
      }

      const updatePayment = await Payment.update(
        { name, number, type },
        { where: { id } }
      );

      const updated = await Payment.findOne({ where: { id } });
      return res.status(201).json({
        status: true,
        message: "Payments Updated Successfully",
        data: {
          name: updated.name,
          number: updated.number,
          type: updated.type,
          user_id: user.id,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const paymentExist = await Payment.findOne({ where: { id } });
      if (!paymentExist) {
        return res.status(200).json({
          status: false,
          message: "Payment Method not found",
          data: paymentExist,
        });
      }

      const deletePaymentMethod = await Payment.destroy({ where: { id } });

      return res.status(200).json({
        status: true,
        message: "Payment Method Deleted Successfully",
        data: deletePaymentMethod,
      });
    } catch (error) {
      next(error);
    }
  },
};
