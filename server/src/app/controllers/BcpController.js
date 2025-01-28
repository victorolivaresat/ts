const Bcp = require("../models/Bcp");
const { Op } = require("sequelize");
const { getPaginatedData } = require("../utils/queryUtils");

const getBcp = async (req, res) => {
  const { id } = req.params;
  try {
    const bcp = await Bcp.findByPk(id);
    if (bcp) {
      res.json(bcp);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBcps = async (req, res) => {
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

    console.log(req.query);

    const result = await getPaginatedData(Bcp, req.query, searchFields, {
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
    const bcp = await Bcp.findByPk(id);
    if (bcp) {
      bcp.status = !bcp.status;
      await bcp.save();
      res.json(bcp);
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
    const bcp = await Bcp.findByPk(id);
    if (bcp) {
      bcp.observations = req.body.observations;
      await bcp.save();
      res.json(bcp);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBcp,
  getBcps,
  changeStatus,
  addObservations,
};
