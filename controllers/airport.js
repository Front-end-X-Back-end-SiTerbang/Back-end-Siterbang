const { Airport } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airports = await Airport.findAll();

      if (!airports.length) {
        return res.status(404).json({
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
  search: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = limit * page;
      const upper = search.toUpperCase();
      const totalRows = await Airport.count({
        where: {
          [Op.or]: [
            {
              iata_code: {
                [Op.like]: "%" + upper + "%",
              },
            },
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              country: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await Airport.findAll({
        where: {
          [Op.or]: [
            {
              iata_code: {
                [Op.like]: "%" + upper + "%",
              },
            },
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              country: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      next(error);
    }
  },
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
        return res.status(404).json({
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
  count: async (req, res, next) => {
    try {
      const countLocal = await Airport.count({
        where: { country: "INDONESIA" },
      });
      const countIntl = await Airport.count({
        where: { country: { [Op.not]: "INDONESIA" } },
      });
      
      return res.status(200).json({
        status: true,
        message: "success count Airport data",
        data: {
          indonesian_airport: countLocal,
          overseas_airport: countIntl,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
