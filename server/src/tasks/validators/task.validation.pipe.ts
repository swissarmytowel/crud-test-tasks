import { ObjectSchema } from '@hapi/joi';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class TaskValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    console.error(error);
    if (error) {
      throw new BadRequestException('Record format is not valid!');
    }
    return value;
  }
}
