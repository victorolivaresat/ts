const { Op } = require("sequelize");

const getPaginatedData = async (model, query, searchFields, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "ASC",
    search = "",
  } = query;

  const { attributes = null, where = {} } = options;

  // Lógica de paginación - Validar valores de paginación
  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.max(1, parseInt(limit));
  const offset = (pageNumber - 1) * limitNumber;

  // Validar sortOrder para evitar valores inválidos
  // Validar valores de orden
  const validSortOrder = ["ASC", "DESC"];
  const orderDirection = validSortOrder.includes(order.toUpperCase())
    ? order.toUpperCase()
    : "ASC";


  // Construir el whereClause para búsqueda
  const whereClause = {
    ...where,
    ...(search
      ? {
          [Op.or]: searchFields.map((field) => ({
            [field]: { [Op.like]: `%${search}%` },
          })),
        }
      : {}),
  };

  // Consultar el modelo
  const result = await model.findAndCountAll({
    where: whereClause,
    attributes,
    limit: limitNumber,
    offset,
    order: [[sort, orderDirection]],
  });

  // Retornar la respuesta paginada
  return {
    totalItems: result.count,
    totalPages: Math.ceil(result.count / limit),
    currentPage: parseInt(page),
    data: result.rows,
  };
};

module.exports = {
  getPaginatedData,
};

