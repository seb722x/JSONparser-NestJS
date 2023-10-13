import { IsString } from 'class-validator';
import { SES } from './ses.model';
import { Type } from 'class-transformer';

export class EmailRecord {
  @IsString()
  eventVersion: string;

  @Type(() => SES)
  ses: SES;
}
