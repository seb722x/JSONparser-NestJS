import { IsString } from 'class-validator';

export class Action {
  @IsString()
  type: string;

  @IsString()
  topicArn: string;
}
