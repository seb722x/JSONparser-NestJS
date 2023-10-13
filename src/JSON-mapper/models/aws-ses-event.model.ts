import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { EmailRecord } from './email-record.model';

export class AwsSesEvent {
  @Type(() => EmailRecord)
  @IsArray()
  Records: EmailRecord[];
}
