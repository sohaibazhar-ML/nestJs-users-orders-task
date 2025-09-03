
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid reference: ${exception.meta?.field_name || 'Foreign key violation'}`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      default:
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Prisma Error',
    });
  }
}
