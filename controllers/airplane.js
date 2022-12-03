const { Airplane } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airplanes = await Airplane.findAll();

      if (!airplanes.length) {
        return res.status(200).json({
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
        message: "success get all airplane",
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
};
