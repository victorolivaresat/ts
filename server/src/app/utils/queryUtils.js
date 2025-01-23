const { Op } = require("sequelize");

const getPaginatedData = async (model, query, searchFields, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    sortOrder = "ASC",
    search = "",
  } = query;

  const { attributes = null } = options;

  // Pagination logic
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Validate sortOrder to prevent invalid values
  const validSortOrder = ["ASC", "DESC"];
  const orderDirection = validSortOrder.includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "ASC";

  // Build the where clause for search
  const whereClause = search
    ? {
        [Op.or]: searchFields.map((field) => ({
          [field]: { [Op.like]: `%${search}%` },
        })),
      }
    : {};

  // Query the model
  const result = await model.findAndCountAll({
    where: whereClause,
    attributes,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, orderDirection]],
  });

  // Return paginated response
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
