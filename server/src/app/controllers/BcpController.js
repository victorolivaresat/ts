const Bcp = require("../models/Bcp");
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
    const searchFields = ["beneficiary", "amount"];
    const result = await getPaginatedData(
      Bcp,
      req.query,
      searchFields,
      { attributes: { exclude: ["password"] } }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = {
  getBcp,
  getBcps,
  changeStatus,
};
