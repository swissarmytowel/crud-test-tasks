import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!))';
  }
}
