import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      url: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
