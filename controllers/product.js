const { Product } = require("../models");
const airplane = require("./airplane");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const products = await Product.findAll();

      if (!products.length) {
        return res.status(200).json({
          status: false,
          message: "No Products found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all products",
        data: products,
      });
    } catch (error) {
      next(err);
    }
  },
  find: async (req, res, next) => {},
  create: async (req, res, next) => {
    try {
      const {
        origin,
        destination_id,
        price,
        stock,
        transit_total,
        flight_date,
        airplane_id,
        estimation,
        code,
        gate,
        terminal,
        type,
      } = req.body;

      const newProduct = await Product.create({
        origin,
        destination_id,
        price,
        stock,
        transit_total,
        flight_date,
        airline_id: airplane.airline_id,
        airplane_id,
        estimation,
        create_date: Date.now(),
        code,
        gate,
        terminal,
        type,
      });

      return res.status(201).json({
        status: true,
        message: "Product added successfully",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const {
        origin,
        destination_id,
        price,
        stock,
        transit_total,
        flight_date,
        airplane_id,
        estimation,
        code,
        gate,
        terminal,
        type,
      } = req.body;
      const { id } = req.params;

      const productExist = await Product.findOne({ where: { id } });
      if (!productExist) {
        return res.status(200).json({
          status: false,
          message: "Products not found",
          data: productExist,
        });
      }

      const updateProduct = await Product.update(
        {
          origin,
          destination_id,
          price,
          stock,
          transit_total,
          flight_date,
          airline_id: airplane.airline_id,
          airplane_id,
          create_date: Date.now(),
          estimation,
          code,
          gate,
          terminal,
          type,
        },
        { where: { id } }
      );

      const updatedProduct = await Product.fineOne({ where: { id } });
      return res.status(201).json({
        status: true,
        message: "Products updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const productExist = await Product.findOne({ where: { id } });
      if (!productExist) {
        return res.status(200).json({
          status: false,
          message: "Products not found",
          data: productExist,
        });
      }

      const deleteProduct = await Product.destroy({ where: { id } });
      return res.status(200).json({
        status: true,
        message: "Product deleted successfully",
        data: deleteProduct,
      });
    } catch (error) {
      nexy(error);
    }
  },
};
