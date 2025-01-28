const Ibk = require("../models/Ibk");
const { Op } = require("sequelize");
const { getPaginatedData } = require("../utils/queryUtils");

const getIbk = async (req, res) => {
  const { id } = req.params;
  try {
    const Ibk = await Ibk.findByPk(id);
    if (Ibk) {
      res.json(Ibk);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIbks = async (req, res) => {
  try {
    const searchFields = ["beneficiary"];
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
      where.created_at = dateFilter;
    }

    const result = await getPaginatedData(Ibk, req.query, searchFields, {
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
    const ibk = await ibk.findByPk(id);
    if (ibk) {
      ibk.status = !ibk.status;
      await Ibk.save();
      res.json(ibk);
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
    const ibk = await Ibk.findByPk(id);
    if (ibk) {
      ibk.observations = req.body.observations;
      await ibk.save();
      res.json(ibk);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIbk,
  getIbks,
  changeStatus,
  addObservations,
};
