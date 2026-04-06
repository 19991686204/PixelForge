import { Response } from 'express';

/**
 * 统一成功响应格式
 * @param res - Express Response 对象
 * @param data - 返回的数据
 * @param message - 成功消息
 * @param statusCode - HTTP 状态码
 */
export const successResponse = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 统一错误响应格式
 * @param res - Express Response 对象
 * @param message - 错误消息
 * @param statusCode - HTTP 状态码
 * @param errors - 详细错误信息
 */
export const errorResponse = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  errors: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 分页响应格式
 * @param res - Express Response 对象
 * @param data - 数据数组
 * @param page - 当前页码
 * @param limit - 每页数量
 * @param total - 总数据量
 */
export const paginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number
) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};
