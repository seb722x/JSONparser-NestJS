import { IsString, IsInt, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { Action } from './action.model';

export class Receipt {
  @IsString()
  timestamp: string;

  @IsInt()
  processingTimeMillis: number;

  @IsArray()
  recipients: string[];

  @IsBoolean()
  spamVerdict: { status: string };

  @IsBoolean()
  virusVerdict: { status: string };

  @IsBoolean()
  spfVerdict: { status: string };

  @IsBoolean()
  dkimVerdict: { status: string };

  @IsBoolean()
  dmarcVerdict: { status: string };

  @IsString()
  dmarcPolicy: string;

  @Type(() => Action)
  action: Action;
}
