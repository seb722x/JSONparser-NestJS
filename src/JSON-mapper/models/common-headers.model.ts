import { IsString } from 'class-validator';

export class CommonHeaders {
  @IsString()
  returnPath: string;

  @IsString()
  from: string[];

  @IsString()
  date: string;

  @IsString()
  to: string[];

  @IsString()
  messageId: string;

  @IsString()
  subject: string;
}
