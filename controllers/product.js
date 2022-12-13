const { Product, Airport, Airplane } = require("../models");
const { Op } = require("sequelize");
const { FLIGHT_CLASS } = require("../utils/enum");

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
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { id },
      });

      const origin = await Airport.findOne({
        where: { id: product.origin_id },
      });
      const destination = await Airport.findOne({
        where: { id: product.destination_id },
      });

      return res.status(200).json({
        status: true,
        message: "success get product details",
        data: {
          origin: origin.city,
          destination: destination.city,
          details: product,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        origin_id,
        destination_id,
        transit_total,
        flight_date,
        depature_hours,
        airplane_id,
        estimation,
        gate,
        terminal,
      } = req.body;

      let { price, type } = req.body;

      const airplane = await Airplane.findOne({
        where: { id: airplane_id },
        include: ["airline"],
      });
      if (!airplane) {
        return res.status(200).json({
          status: false,
          message: "Airplane not found",
          data: airplane,
        });
      }
      if (airplane.capacity <= 10) {
        return res.status(200).json({
          status: false,
          message: "Airplane capacity is to small",
          data: {
            airplane: airplane.name,
            airline: airplane.airline.name,
            capacity: airplane.capacity,
          },
        });
      }
      const classes = type;
      if (type == FLIGHT_CLASS.ECONOMY) {
      } else if (type == FLIGHT_CLASS.BUSINESS) {
        price = price + (price * 15) / 100;
      } else if (type == FLIGHT_CLASS.FIRST) {
        price = price + (price * 45) / 100;
      } else {
        return res.status(422).json({
          status: false,
          message: "Flight Classes not Found",
          data: null,
        });
      }
      function makeid(length) {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      }

      const newProduct = await Product.create({
        origin_id,
        destination_id,
        price: price,
        stock: airplane.capacity,
        transit_total,
        flight_date,
        depature_hours,
        airplane_id,
        airline_id: airplane.airline_id,
        estimation,
        code: makeid(5),
        gate,
        terminal,
        type: classes,
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
  search: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const origin = req.query.origin || "";
      const destination = req.query.destination || "";
      const date = req.query.flight_date || "";
      const kelas = req.query.class || "";
      const offset = limit * page;
      const roundTrip = req.query.roundTrip;
      const returnDate = req.query.returnDate;
      const orig = await Airport.findOne({
        where: { city: origin },
      });
      const dest = await Airport.findOne({
        where: { city: destination },
      });
      console.log(roundTrip);
      console.log(kelas);
      if (roundTrip) {
        console.log("round trip executed");
        if (!kelas) {
          console.log("all class executed");
          const totalRows = await Product.count({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                    { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                    { flight_date: { [Op.like]: "%" + date + "%" } },
                  ],
                },
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + dest.id + "%" } },
                    { destination_id: { [Op.like]: "%" + orig.id + "%" } },
                    { flight_date: { [Op.like]: "%" + returnDate + "%" } },
                  ],
                },
              ],
            },
          });
          // round trip , all type
          const totalPage = Math.ceil(totalRows / limit);
          const result = await Product.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                    { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                    { flight_date: { [Op.like]: "%" + date + "%" } },
                  ],
                },
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + dest.id + "%" } },
                    { destination_id: { [Op.like]: "%" + orig.id + "%" } },
                    { flight_date: { [Op.like]: "%" + returnDate + "%" } },
                  ],
                },
              ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "ASC"]],
          });
          res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          });
        } else {
          //round trip , specific type
          console.log('specific class executed')
          const totalRows = await Product.count({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                    { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                    { flight_date: { [Op.like]: "%" + date + "%" } },
                    { type: { [Op.like]: "%" + kelas + "%" } },
                  ],
                },
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + dest.id + "%" } },
                    { destination_id: { [Op.like]: "%" + orig.id + "%" } },
                    { flight_date: { [Op.like]: "%" + returnDate + "%" } },
                    { type: { [Op.like]: "%" + kelas + "%" } },
                  ],
                },
              ],
            },
          });
          const totalPage = Math.ceil(totalRows / limit);
          const result = await Product.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                    { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                    { flight_date: { [Op.like]: "%" + date + "%" } },
                    { type: { [Op.like]: "%" + kelas + "%" } },
                  ],
                },
                {
                  [Op.and]: [
                    { origin_id: { [Op.like]: "%" + dest.id + "%" } },
                    { destination_id: { [Op.like]: "%" + orig.id + "%" } },
                    { flight_date: { [Op.like]: "%" + returnDate + "%" } },
                    { type: { [Op.like]: "%" + kelas + "%" } },
                  ],
                },
              ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "ASC"]],
          });
          res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          });
        }
      } else {
        //one way , all type
        if (!kelas.length) {
          const totalRows = await Product.count({
            where: {
              [Op.and]: [
                { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                { flight_date: { [Op.like]: "%" + date + "%" } },
              ],
            },
          });
          const totalPage = Math.ceil(totalRows / limit);
          const result = await Product.findAll({
            where: {
              [Op.and]: [
                { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                { flight_date: { [Op.like]: "%" + date + "%" } },
              ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "ASC"]],
          });
          res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          });
        } else {
          //one way , specific type
          const totalRows = await Product.count({
            where: {
              [Op.and]: [
                { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                { flight_date: { [Op.like]: "%" + date + "%" } },
                { type: { [Op.like]: "%" + kelas + "%" } },
              ],
            },
          });
          const totalPage = Math.ceil(totalRows / limit);
          const result = await Product.findAll({
            where: {
              [Op.and]: [
                { origin_id: { [Op.like]: "%" + orig.id + "%" } },
                { destination_id: { [Op.like]: "%" + dest.id + "%" } },
                { flight_date: { [Op.like]: "%" + date + "%" } },
                { type: { [Op.like]: "%" + kelas + "%" } },
              ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "ASC"]],
          });
          res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage,
          });
        }
      }
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
          create_date,
          estimation,
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
  count: async (req, res, next) => {
    try {
      const count = await Product.count();
      return res.status(200).json({
        status: true,
        message: "success count product data",
        data: count,
      });
    } catch (error) {
      next(error);
    }
  },
};
