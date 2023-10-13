import { IsString, IsArray, IsBoolean } from 'class-validator';
import { Header } from './headers.model';
import { CommonHeaders } from './common-headers.model';
import { Type } from 'class-transformer';

export class Mail {
  @IsString()
  timestamp: string;

  @IsString()
  source: string;

  @IsString()
  messageId: string;

  @IsArray()
  destination: string[];

  @IsBoolean()
  headersTruncated: boolean;

  @Type(() => Header)
  headers: Header[];

  @Type(() => CommonHeaders)
  commonHeaders: CommonHeaders;
}
