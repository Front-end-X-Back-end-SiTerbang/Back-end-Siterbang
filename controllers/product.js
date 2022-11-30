const { Product, Airport } = require("../models");

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
  find: async (req, res, next) => {
    const { origin, destination, flight_date, type } = req.query;

    const getOr_id = await Airport.findOne({
      where: { city: origin },
    });
    const getDes_id = await Airport.findOne({
      where: { city: destination },
    });

    if (!getOr_id) {
      return res.status(200).json({
        status: false,
        message: "Product with your origin not found",
        data: getOr_id,
      });
    }
    if (!getDes_id) {
      return res.status(200).json({
        status: false,
        message: "Product with your destination not found",
        data: getDes_id,
      });
    }
    const origin_id = getOr_id.id;
    const destination_id = getDes_id.id;
    const findProduct = await Product.findAll({
      where: { origin_id, destination_id, flight_date, type },
    });

    if (!findProduct.length) {
      return res.status(200).json({
        status: false,
        message: "Product with your origin or destination not found",
        data: findProduct,
      });
    }
  },
  create: async (req, res, next) => {
    try {
      const {
        origin_id,
        destination_id,
        price,
        stock,
        transit_total,
        flight_date,
        depature_hours,
        airline_id,
        airplane_id,
        estimation,
        code,
        gate,
        terminal,
        type,
      } = req.body;

      const newProduct = await Product.create({
        origin_id,
        destination_id,
        price,
        stock,
        transit_total,
        flight_date,
        depature_hours,
        airplane_id,
        airline_id,
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
        origin_id,
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
          origin_id,
          destination_id,
          price,
          stock,
          transit_total,
          flight_date,
          airline_id,
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

      const updatedProduct = await Product.findOne({ where: { id } });
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
