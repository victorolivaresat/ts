const BcpReconciliation = require("../models/BcpReconciliation");
const IbkReconciliation = require("../models/IbkReconciliation");
const { getPaginatedData } = require("../utils/queryUtils");
const Bcp = require("../models/Bcp");
const Ibk = require("../models/Ibk");
const At = require("../models/At");
const { Op } = require("sequelize");

// Obtener una reconciliación por ID con más detalles
const getBcpReconciliation = async (req, res) => {
  const { id } = req.params;
  try {
    const reconciliation = await BcpReconciliation.findByPk(id, {
      include: [
        {
          model: Bcp,
          as: "bcp", // Alias de la relación con bcp_notifications
          attributes: [
            "id",
            "operation_type",
            "date_time",
            "operation_number",
            "ordering_company",
            "account_charge",
            "beneficiary", // Incluye el beneficiario
            "account_destination", // Incluye la cuenta destino
            "amount", // Incluye el monto
            "status", // Incluye el estado
            "observations", // Incluye las observaciones
            "created_at",
            "updated_at",
          ], // Campos específicos de la tabla bcp_notifications
        },
        {
          model: At,
          as: "at", // Alias de la relación con at
          attributes: [
            "id",
            "cod_transaction",
            "request_date",
            "payment_date",
            "user",
            "cash_station",
            "first_name",
            "last_name",
            "bank",
            "account_number", // Incluye el número de cuenta
            "cci", // Incluye el CCI
            "payment_bank", // Incluye el banco de pago
            "amount", // Incluye el monto
            "commission", // Incluye la comisión
            "operation_number", // Incluye el número de operación
            "status", // Incluye el estado
            "rejection_reason", // Incluye la razón de rechazo
            "payer", // Incluye el pagador
            "reason", // Incluye la razón
            "receipt", // Incluye el recibo
            "type", // Incluye el tipo
            "approved_by", // Incluye el aprobado por
            "validated", // Incluye la validación
            "observations", // Incluye las observaciones
            "created_at",
            "updated_at",
          ], // Campos específicos de la tabla at
        },
      ],
    });

    if (reconciliation) {
      res.json(reconciliation);
    } else {
      res.status(404).json({ message: "Reconciliation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las reconciliaciones con paginación y más detalles
const getBcpReconciliations = async (req, res) => {
  try {
    const searchFields = ["$bcp.beneficiary$"];
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

    const result = await getPaginatedData(
      BcpReconciliation,
      req.query,
      searchFields,
      {
        include: [
          {
            model: Bcp,
            as: "bcp",
            attributes: [
              "id",
              "operation_type",
              "date_time",
              "operation_number",
              "ordering_company",
              "account_charge",
              "beneficiary",
              "account_destination",
              "amount",
              "status",
              "observations",
              "created_at",
              "updated_at",
            ],
          },
          {
            model: At,
            as: "at",
            attributes: [
              "id",
              "cod_transaction",
              "request_date",
              "payment_date",
              "user",
              "cash_station",
              "first_name",
              "last_name",
              "bank",
              "account_number",
              "cci",
              "payment_bank",
              "amount",
              "commission",
              "operation_number",
              "status",
              "rejection_reason",
              "payer",
              "reason",
              "receipt",
              "type",
              "approved_by",
              "validated",
              "observations",
              "created_at",
              "updated_at",
            ],
          },
        ],
        where,
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIbkReconciliation = async (req, res) => {
  const { id } = req.params;
  try {
    const reconciliation = await IbkReconciliation.findByPk(id, {
      include: [
        {
          model: Ibk,
          as: "ibk",
          attributes: [
            "id",
            "beneficiary",
            "date_time",
            "number_application",
            "ordering_company",
            "account_charge",
            "account_destination",
            "amount",
            "status",
            "observations",
            "created_at",
            "updated_at",
          ],
        },
        {
          model: At,
          as: "at",
          attributes: [
            "id",
            "cod_transaction",
            "request_date",
            "payment_date",
            "user",
            "cash_station",
            "first_name",
            "last_name",
            "bank",
            "account_number",
            "cci",
            "payment_bank",
            "amount",
            "commission",
            "operation_number",
            "status",
            "rejection_reason",
            "payer",
            "reason",
            "receipt",
            "type",
            "approved_by",
            "validated",
            "observations",
            "created_at",
            "updated_at",
          ],
        },
      ],
    });

    if (reconciliation) {
      res.json(reconciliation);
    } else {
      res.status(404).json({ message: "Reconciliation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIbkReconciliations = async (req, res) => {
  try {
    const searchFields = ["$ibk.beneficiary$"];
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

    const result = await getPaginatedData(
      IbkReconciliation,
      req.query,
      searchFields,
      {
        include: [
          {
            model: Ibk,
            as: "ibk",
            attributes: [
              "id",
              "beneficiary",
              "date_time",
              "number_application",
              "ordering_company",
              "account_charge",
              "account_destination",
              "amount",
              "status",
              "observations",
              "created_at",
              "updated_at",
            ],
          },
          {
            model: At,
            as: "at",
            attributes: [
              "id",
              "cod_transaction",
              "request_date",
              "payment_date",
              "user",
              "cash_station",
              "first_name",
              "last_name",
              "bank",
              "account_number",
              "cci",
              "payment_bank",
              "amount",
              "commission",
              "operation_number",
              "status",
              "rejection_reason",
              "payer",
              "reason",
              "receipt",
              "type",
              "approved_by",
              "validated",
              "observations",
              "created_at",
              "updated_at",
            ],
          },
        ],
        where,
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBcpReconciliation,
  getBcpReconciliations,
  getIbkReconciliation,
  getIbkReconciliations,
};
