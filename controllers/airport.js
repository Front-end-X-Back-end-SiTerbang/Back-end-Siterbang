const { Airport } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airports = await Airport.findAll();

      if (!airports.length) {
        return res.status(200).json({
          status: false,
          message: "No Airports found",
          data: airports,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all airports data",
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  },
  createAirport: async (req, res, next) => {
    try {
      const { iata_code, name, city, country } = req.body;

      //check airport
      const airportExist = await Airport.findOne({ where: { iata_code } });
      if (airportExist) {
        return res.status(409).json({
          status: false,
          message: "Airport already exist!",
          data: null,
        });
      }

      const newAirport = await Airport.create({
        iata_code,
        name,
        city,
        country,
      });

      return res.status(201).json({
        status: true,
        message: "Airport added successfully!",
        data: newAirport,
      });
    } catch (error) {
      next(error);
    }
  },
  // need to add : search by query
  get: async (req, res, next) => {
    try {
      const { iata_code } = req.params;

      const upper = iata_code.toUpperCase();
      console.log(upper);
      const airports = await Airport.findOne({
        where: { iata_code: upper },
      });

      if (!airports) {
        return res.status(200).json({
          status: false,
          message: "Airports not found",
          data: airports,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get airports",
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { name, city, country } = req.body;
      const { iata_code } = req.params;

      const airlineExist = await Airport.findOne({ where: { iata_code } });
      if (!airlineExist) {
        return res.status(200).json({
          status: false,
          message: "Airports not found",
          data: airlineExist,
        });
      }

      const updateAirport = await Airport.update(
        { name, city, country },
        { where: { iata_code } }
      );

      const updated = await Airport.findOne({ where: { iata_code } });
      return res.status(201).json({
        status: true,
        message: "Airports Updated Successfully",
        data: {
          name: updated.name,
          city: updated.city,
          country: updated.country,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { iata_code } = req.params;
      const airlineExist = await Airport.findOne({ where: { iata_code } });
      if (!airlineExist) {
        return res.status(200).json({
          status: false,
          message: "Airports not found",
          data: airlineExist,
        });
      }

      const deleteAirport = await Airport.destroy({ where: { iata_code } });

      return res.status(200).json({
        status: true,
        message: "Airports Deleted Successfully",
        data: deleteAirport,
      });
    } catch (error) {
      next(error);
    }
  },
};