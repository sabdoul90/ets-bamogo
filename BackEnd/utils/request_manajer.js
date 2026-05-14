module.exports = ({ page = 1, limit = 10, order = "DESC" }, includeMap, includeQuery) => {
  const offset = (page - 1) * limit;

  let includes = [];

  if (includeQuery) {
    const requested = includeQuery.split(',');
    includes = requested
      .map(rel => includeMap[rel])
      .filter(Boolean);
  }

  return {
    limit: parseInt(limit),
    offset,
    include: includes,
    order: [["createdAt",order]]
  };
};