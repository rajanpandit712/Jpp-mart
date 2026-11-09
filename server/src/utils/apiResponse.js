class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, data, message = 'Created successfully') {
    return res.status(201).json(new ApiResponse(201, data, message));
  }

  static paginated(res, { items, page, limit, total, totalPages }, message = 'Success') {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;
