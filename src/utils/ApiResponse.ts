import { Response } from "express";

class ApiResponse {
  static success(res: Response, data: unknown, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  static error(res: Response, message: string, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  static paginated(
    res: Response,
    data: unknown,
    total: number,
    page: number,
    limit: number
  ) {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
}

export default ApiResponse;
