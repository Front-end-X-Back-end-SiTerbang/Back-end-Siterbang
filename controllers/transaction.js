const { Transaction, Product, Payment } = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const transactions = await Transaction.findAll();

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
      const { product_id, total_passenger } = req.body;

      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);

      const product = await Product.findOne({ where: { id: product_id } });
      if (!product) {
        return res.status(200).json({
          status: false,
          message: "Products not found",
          data: product,
        });
      }

      const price = product.price;
      const total = price * total_passenger;
      const newTransaction = await Transaction.create({
        product_id,
        is_paid: false,
        is_cancelled: false,
        user_id: user.id,
        total_order: total,
        total_passenger,
      });

      return res.status(201).json({
        status: true,
        message: "success create transaction",
        data: newTransaction,
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
        include: ["product", "booking_details"],
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
          data: payment.balance,
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
};
