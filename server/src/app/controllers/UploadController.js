const { sequelize } = require("../../config/database");
const At = require("../models/At");
const xlsx = require("xlsx");
const fs = require("fs");

const uploadExcel = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Leer el archivo Excel desde el buffer en memoria
    const workbook = xlsx.read(file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Elimina la primera fila (encabezados)
    data.shift();

    let validRecords = [];
    let errorRecords = [];

    // Procesar cada fila individualmente
    for (const row of data) {
      const paymentDate = row[2];

      // Validación de payment_date
      if (!paymentDate) {
        errorRecords.push({
          cod_transaction: row[0],
          error: "payment_date is missing or invalid",
        });
        continue;
      }

      const record = {
        cod_transaction: row[0],
        request_date: row[1],
        payment_date: paymentDate,
        user: row[3],
        cash_station: row[4],
        first_name: row[5],
        last_name: row[6],
        bank: row[7],
        account_number: row[8] ? row[8].toString() : "",
        cci: row[9] ? row[9].toString() : "",
        payment_bank: row[10],
        amount: parseFloat(row[11]),
        commission: parseFloat(row[12]),
        operation_number: row[13],
        status: row[14],
        rejection_reason: row[15],
        payer: row[16],
        reason: row[17],
        receipt: row[18],
        type: row[19],
        approved_by: row[20],
        validated: false,
        observations: row[21],
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Agregar el registro a los válidos
      validRecords.push(record);
    }

    // Si no hay registros válidos, enviar un mensaje de error
    if (validRecords.length === 0) {
      return res.status(400).json({ message: "No valid records to upload." });
    }

    // Guardar los registros válidos en la base de datos
    await At.bulkCreate(validRecords);

    // Si hay registros con errores, guardar un archivo de errores (opcional)
    if (errorRecords.length > 0) {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
      const errorFilePath = "./src/logs/time_" + timestamp + ".json";

      fs.writeFileSync(errorFilePath, JSON.stringify(errorRecords, null, 2));

      return res.json({
        message: "File uploaded, but some records have errors.",
        validRecordsCount: validRecords.length,
        errorRecordsCount: errorRecords.length,
        errorFile: errorFilePath,
        errorDetails: errorRecords,
      });
    }

    res.json({
      message: "File uploaded and data saved successfully",
      validRecordsCount: validRecords.length,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getRecentNotificationSums = async (req, res) => {
  try {
    const results = await sequelize.query(
      "EXEC GetTotalizedRecentNotifications",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const groupedResults = results.reduce((acc, row) => {
      const { LoadedDate, OperationDate, TotalAmount, TableOrigin } = row;

      if (!acc[LoadedDate]) {
        acc[LoadedDate] = [];
      }

      acc[LoadedDate].push({
        operationDate: OperationDate,
        totalAmount: TotalAmount,
        source: TableOrigin,
      });

      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedResults,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadExcel,
  getRecentNotificationSums,
};
