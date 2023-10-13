import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Receipt } from './receipt.model';
import { Mail } from './mail.model';

export class SES {
  @Type(() => Receipt)
  receipt: Receipt;

  @Type(() => Mail)
  mail: Mail;
}
