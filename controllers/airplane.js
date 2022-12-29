const { Airplane, Airline } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airplanes = await Airplane.findAll({ include: ["airline"] });

      if (!airplanes.length) {
        return res.status(404).json({
          status: false,
          message: "No Airplanes found",
          data: airplanes,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all airplane data",
        data: airplanes,
      });
    } catch (error) {
      next(error);
    }
  },
  createAirplane: async (req, res, next) => {
    try {
      const { name, airline_id, type, capacity } = req.body;

      //check airplane
      const aircraftExist = await Airplane.findOne({ where: { name } });
      if (aircraftExist) {
        return res.status(409).json({
          status: false,
          message: "Airplane already exist!",
          data: null,
        });
      }

      const airlineExist = await Airline.findOne({ where: { id: airline_id } });
      if (!airlineExist) {
        return res.status(400).json({
          status: false,
          message: "airline not found",
          data: airlineExist,
        });
      }

      const newAirplane = await Airplane.create({
        name,
        airline_id,
        type,
        capacity,
      });

      return res.status(201).json({
        status: true,
        message: "Airplane added successfully!",
        data: newAirplane,
      });
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airplane = await Airplane.findOne({ where: { id } });

      if (!airplane) {
        return res.status(200).json({
          status: false,
          message: "Airplanes not found",
          data: airplane,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get airplane",
        data: airplane,
      });
    } catch (error) {
      next(error);
    }
  },
  getByAirlines: async (req, res, next) => {
    try {
      const { airlines_id } = req.params;
      const airplane = await Airplane.findAll({
        where: { airline_id: airlines_id },
      });

      if (!airplane.length) {
        return res.status(200).json({
          status: false,
          message: "This Airlines doesn't have airplane yet",
          data: airplane,
        });
      }
      return res.status(200).json({
        status: true,
        message: "success get all airplane",
        data: airplane,
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

      const airlines = await Airline.findOne({
        where: { name: { [Op.like]: "%" + search + "%" } },
        attributes: ["id"],
      });
      if (airlines == null) {
        const totalRows = await Airplane.count({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + search + "%" } },
              { type: { [Op.like]: "%" + search + "%" } },
            ],
          },
        });
        const totalPage = Math.ceil(totalRows / limit);
        const result = await Airplane.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + search + "%" } },
              { type: { [Op.like]: "%" + search + "%" } },
            ],
          },
          offset: offset,
          limit: limit,
          order: [["name", "DESC"]],
        });
        res.json({
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        });
      } else {
        const totalRows = await Airplane.count({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + search + "%" } },
              { type: { [Op.like]: "%" + search + "%" } },
              { airline_id: airlines.id },
            ],
          },
        });
        const totalPage = Math.ceil(totalRows / limit);
        const result = await Airplane.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + search + "%" } },
              { type: { [Op.like]: "%" + search + "%" } },
              { airline_id: airlines.id },
            ],
          },
          offset: offset,
          limit: limit,
          order: [["name", "DESC"]],
        });
        res.json({
          result: result,
          page: page,
          limit: limit,
          totalRows: totalRows,
          totalPage: totalPage,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { name, airline_id, type, destination_id } = req.body;
      const { id } = req.params;

      const aircraftExist = await Airplane.findOne({ where: { id } });
      if (!aircraftExist) {
        return res.status(200).json({
          status: false,
          message: "Airplanes not found",
          data: aircraftExist,
        });
      }

      const updateAirplane = await Airplane.update(
        { name, airline_id, type },
        { where: { id } }
      );

      const updated = await Airplane.findOne({ where: { id } });
      return res.status(201).json({
        status: true,
        message: "Airplanes Updated Successfully",
        data: {
          name: updated.name,
          airline_id: updated.airline_id,
          type: updated.type,
          capacity: updated.capacity,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const aircraftExist = await Airplane.findOne({ where: { id } });
      if (!aircraftExist) {
        return res.status(200).json({
          status: false,
          message: "Airplanes not found",
          data: aircraftExist,
        });
      }

      const deleteAirplane = await Airplane.destroy({ where: { id } });

      return res.status(200).json({
        status: true,
        message: "Airplanes Deleted Successfully",
        data: deleteAirplane,
      });
    } catch (error) {
      next(error);
    }
  },
  count: async (req, res, next) => {
    try {
      const count = await Airplane.count();
      return res.status(200).json({
        status: true,
        message: "success count airplane data",
        data: count,
      });
    } catch (error) {
      next(error);
    }
  },
};
