import { IsString } from 'class-validator';

export class Header {
  @IsString()
  name: string;

  @IsString()
  value: string;
}
