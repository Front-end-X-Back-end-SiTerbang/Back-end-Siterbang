const {
  Transaction,
  Product,
  Payment,
  Booking_detail,
  Airport,
  Airline,
  Notification,
} = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { FLIGHT_CLASS } = require("../utils/enum");
const { update } = require("./airlines");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const transactions = await Transaction.findAll({ include: ["product"] });

      if (!transactions.length) {
        return res.status(200).json({
          status: false,
          message: "No Transactions found",
          data: transactions,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all transactions data",
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },
  createTransaction: async (req, res, next) => {
    try {
      const { product_id, total_passenger, passengers } = req.body;
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);

      const product = await Product.findOne({
        where: { id: product_id },
        include: [{ model: Airport, as: "destination", attributes: ["city"] }],
      });
      if (!product) {
        return res.status(200).json({
          status: false,
          message: "Products not found",
          data: product,
        });
      }

      const price = product.price;
      const total = price * total_passenger;
      const createTransaction = await Transaction.create({
        product_id,
        is_paid: true,
        is_cancelled: false,
        user_id: user.id,
        is_read: false,
        total_order: total,
        total_passenger,
      });

      passengers.forEach(async (element) => {
        const max = 200;
        const seatNum = Math.floor(Math.random() * max + 1);
        const seatCode = ["E", "B", "F"];
        const productType = product.type;
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
        const createPassengers = await Booking_detail.create({
          nik: element.nik,
          passenger_name: element.passenger_name,
          passenger_phone: element.passenger_phone,
          transaction_id: createTransaction.id,
          seat_number: seat,
        });
      });

      const newTransaction = await Transaction.findOne({
        where: { id: createTransaction.id },
        include: ["product"],
      });
      const passengers_detail = await Booking_detail.findAll({
        where: { transaction_id: createTransaction.id },
      });
      const notif = await Notification.create({
        title: "Transaksi Berhasil",
        description: `Cek ticket ke ${product.destination.city} kamu disini`,
        read: false,
        user_id: user.id,
        transaction_id: createTransaction.id,
      });

      return res.status(201).json({
        status: true,
        message: "success create transaction",
        data: { transaction: newTransaction, passengers_detail },
      });
    } catch (error) {
      next(error);
    }
  },
  getUserTransaction: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);
      const userTransactions = await Transaction.findAll({
        where: { user_id: user.id, is_cancelled: false },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              { model: Airline, as: "airline", attributes: ["name"] },
              {
                model: Airport,
                as: "origin",
                attributes: ["iata_code", "city", "name"],
              },
              {
                model: Airport,
                as: "destination",
                attributes: ["iata_code", "city", "name"],
              },
            ],
          },
          "booking_details",
        ],
        order: [["id", "DESC"]],
      });
      if (!userTransactions.length) {
        return res.status(200).json({
          status: false,
          message: "You haven't made any transactions",
          data: userTransactions,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get user transactions",
        data: userTransactions,
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findOne({
        where: { id },
        include: ["product", "booking_details"],
      });
      if (!transaction) {
        return res.status(200).json({
          status: false,
          message: "Transactions not found",
          data: transaction,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success get transaction",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  getProductTransaction: async (req, res, next) => {
    const { id } = req.params;

    const transactions = await Transaction.findAll({
      where: { product_id: id },
      include: ["booking_details"],
    });
    if (!transactions.length) {
      return res.status(200).json({
        status: false,
        message: "Products not found",
        data: transactions,
      });
    }
    const product = await Product.findOne({ where: { id } });
    return res.status(200).json({
      status: true,
      message: "success get all product's transactions",
      data: { product: product, transactions: transactions },
    });
  },
  payment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({ where: { id } });
      const payment = await Payment.findOne({
        where: { user_id: transaction.user_id },
      });
      const detailsCount = await Booking_detail.count({
        where: { transaction_id: id },
      });
      if (detailsCount < transaction.total_passenger) {
        return res.status(200).json({
          status: false,
          message: "All passenger data must be filled in",
        });
      }

      if (!payment) {
        return res.status(200).json({
          status: false,
          message: "You haven't set any payment method",
          data: payment,
        });
      } else if (payment.balance < transaction.total_order) {
        return res.status(200).json({
          status: false,
          message: "Insufficient balance!",
          data: {
            balance: payment.balance,
            shortage: transaction.total_order - payment.balance,
          },
        });
      }

      const product = await Product.findOne({
        where: { id: transaction.product_id },
      });
      const newStock = product.stock - transaction.total_passenger;
      const newBalance = payment.balance - transaction.total_order;
      const updateStock = await Product.update(
        { stock: newStock },
        { where: { id: transaction.product_id } }
      );
      const updateTransaction = await Transaction.update(
        { is_paid: true },
        { where: { id } }
      );
      const updateBalance = await Payment.update(
        { balance: newBalance },
        { where: { user_id: transaction.user_id } }
      );
      const updatedTransaction = await Transaction.findOne({
        where: { id },
        include: ["booking_details"],
      });

      return res.status(200).json({
        status: true,
        message: "Transaction success",
        data: { stock: newStock, transaction: updatedTransaction },
      });
    } catch (error) {
      next(error);
    }
  },
  cancelTransaction: async (req, res, next) => {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findOne({ where: { id } });
      if (!transaction) {
        return res.status(200).json({
          status: false,
          message: "Transactions not found",
          data: transaction,
        });
      }

      const cancelTransaction = await Transaction.update(
        { is_cancelled: true },
        { where: { id } }
      );
      const cancelled = await Transaction.findOne({
        where: { id },
        include: ["booking_details"],
      });
      return res.status(200).json({
        status: true,
        message: "Transaction cancelled successfully",
        data: cancelled,
      });
    } catch (error) {
      next(error);
    }
  },
  updateTransactionRead: async (req, res, next) => {
    const { id } = req.params;

    const findOne = await Transaction.findOne({
      where: { id },
    });

    const updated = await Transaction.update(
      {
        is_read: true,
      },
      { where: { id } }
    );

    return res.status(200).json({
      status: true,
      message: "success",
      data: updated,
    });
  },
  countAll: async (req, res, next) => {
    try {
      const countAll = await Transaction.count();
      const countUnpaid = await Transaction.count({
        where: { is_paid: false },
      });
      const countPaid = await Transaction.count({ where: { is_paid: true } });
      return res.status(200).json({
        status: true,
        message: "success count transaction data",
        data: {
          transactions: countAll,
          unpaid: countUnpaid,
          paid: countPaid,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  revenue: async (req, res, next) => {
    try {
      const total = await Transaction.sum("total_order", {
        where: { is_paid: true },
      });
      return res.status(200).json({
        status: true,
        message: "success get total income",
        data: total,
      });
    } catch (error) {
      next(error);
    }
  },
};
