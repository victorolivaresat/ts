const At = require("../models/At");
const { Op } = require("sequelize");
const { getPaginatedData } = require("../utils/queryUtils");

const getAt = async (req, res) => {
  const { id } = req.params;
  try {
    const At = await At.findByPk(id);
    if (At) {
      res.json(At);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAts = async (req, res) => {
  try {
    const searchFields = ["first_name", "last_name"];
    const { startDate, endDate } = req.query;

    const where = {};
    const dateFilter = {};

    if (startDate) {
      dateFilter[Op.gte] = new Date(startDate).toISOString();
    }
    if (endDate) {
      dateFilter[Op.lte] = new Date(endDate).toISOString();
    }

    if (startDate || endDate) {
      where.payment_date = dateFilter;
    }

    const result = await getPaginatedData(At, req.query, searchFields, {
      attributes: { exclude: ["password"] },
      where,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const at = await at.findByPk(id);
    if (at) {
      at.status = !at.status;
      await at.save();
      res.json(at);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addObservations = async (req, res) => {
  const { id } = req.params;
  try {
    const at = await at.findByPk(id);
    if (at) {
      at.observations = req.body.observations;
      await at.save();
      res.json(at);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAt,
  getAts,
  changeStatus,
  addObservations,
};
