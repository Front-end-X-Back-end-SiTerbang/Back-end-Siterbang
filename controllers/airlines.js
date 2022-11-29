const { Airline } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airlines = await Airline.findAll();

      if (!airlines.length) {
        return res.status(200).json({
          status: false,
          message: "No Airlines found",
          data: airlines,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all airlines data",
        data: airlines,
      });
    } catch (error) {
      next(error);
    }
  },
  createAirline: async (req, res, next) => {
    try {
      const { name, phone } = req.body;

      //check airline
      const airlineExist = await Airline.findOne({ where: { name } });
      if (airlineExist) {
        return res.status(409).json({
          status: false,
          message: "Airline already exist!",
          data: null,
        });
      }

      const newAirline = await Airline.create({
        name,
        phone,
      });

      return res.status(201).json({
        status: true,
        message: "Airline added successfully!",
        data: newAirline,
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airlines = await Airline.findOne({ where: { id } });

      if (!airlines) {
        return res.status(200).json({
          status: false,
          message: "Airlines not found",
          data: airlines,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get airlines",
        data: airlines,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { name, phone } = req.body;
      const { id } = req.params;

      const airlineExist = await Airline.findOne({ where: { id } });
      if (!airlineExist) {
        return res.status(200).json({
          status: false,
          message: "Airlines not found",
          data: airlineExist,
        });
      }

      const updateAirline = await Airline.update(
        { name, phone },
        { where: { id } }
      );

      const updated = await Airline.findOne({ where: { id } });
      return res.status(201).json({
        status: true,
        message: "Airlines Updated Successfully",
        data: {
          name: updated.name,
          phone: updated.phone,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airlineExist = await Airline.findOne({ where: { id } });
      if (!airlineExist) {
        return res.status(200).json({
          status: false,
          message: "Airlines not found",
          data: airlineExist,
        });
      }

      const deleteAirline = await Airline.destroy({ where: { id } });

      return res.status(200).json({
        status: true,
        message: "Airlines Deleted Successfully",
        data: deleteAirline,
      });
    } catch (error) {
      next(error);
    }
  },
};
