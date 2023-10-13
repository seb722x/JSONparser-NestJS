import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AwsSesEvent } from 'src/model/aws-ses-event.model';
import { MappedResponse } from 'src/model/mapped-response.model';

@Injectable()
export class JsonMapperService {
  private readonly logger = new Logger('MailParserService');

  

}