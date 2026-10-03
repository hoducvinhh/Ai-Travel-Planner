import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message;
        error = resObj.error || exception.name;
      } else {
        message = res;
        error = exception.name;
      }
    } else if (this.isPrismaError(exception)) {
      const prismaError = exception as any;
      switch (prismaError.code) {
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          const target = prismaError.meta?.target ? ` (${prismaError.meta.target.join(', ')})` : '';
          message = `Dữ liệu đã tồn tại trên hệ thống${target}. Vui lòng kiểm tra lại.`;
          error = 'Conflict';
          break;
        }
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          message = 'Bản ghi không tồn tại hoặc đã bị xóa.';
          error = 'Not Found';
          break;
        }
        case 'P2003': {
          status = HttpStatus.BAD_REQUEST;
          message = 'Lỗi ràng buộc khóa ngoại dữ liệu.';
          error = 'Foreign Key Constraint Violation';
          break;
        }
        default: {
          status = HttpStatus.BAD_REQUEST;
          message = `Lỗi cơ sở dữ liệu: ${prismaError.message?.split('\n').pop() || 'Thao tác không hợp lệ'}`;
          error = 'Database Error';
          break;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      error = exception.name;
    }

    // Ghi log chi tiết cho các lỗi hệ thống hoặc cảnh báo
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - Error: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    });
  }

  private isPrismaError(exception: any): boolean {
    return (
      exception &&
      typeof exception === 'object' &&
      (exception.constructor?.name === 'PrismaClientKnownRequestError' ||
        typeof exception.code === 'string' && exception.code.startsWith('P'))
    );
  }
}
