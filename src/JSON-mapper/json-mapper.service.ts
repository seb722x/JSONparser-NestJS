import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AwsSesEvent } from './models/aws-ses-event.model';
import { MappedResponse } from './models/mapped-response.model';



@Injectable()
export class JsonMapperService {
  private readonly logger = new Logger('MailParserService');

  mapToMappedData(input: AwsSesEvent): MappedResponse {
    try {
      const mappedData: MappedResponse = {
        spam: this.mapSpam(input),
        virus: this.mapVirus(input),
        dns: this.mapDNS(input),
        mes: this.mapMes(input),
        retrasado: this.mapRetrasado(input),
        emisor: this.mapEmisor(input),
        receptor: this.mapReceptor(input),
      };
  
      return mappedData;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Internal Server Error: ' + error);
    }
  }

  private mapSpam(input: AwsSesEvent): boolean {
    return input.Records[0].ses.receipt.spamVerdict.status === 'PASS';
  }

  private mapVirus(input: AwsSesEvent): boolean {
    return input.Records[0].ses.receipt.virusVerdict.status === 'PASS';
  }

  private mapDNS(input: AwsSesEvent): boolean {
    return (
      input.Records[0].ses.receipt.spfVerdict.status === 'PASS' &&
      input.Records[0].ses.receipt.dkimVerdict.status === 'PASS' &&
      input.Records[0].ses.receipt.dmarcVerdict.status === 'PASS'
    );
  }

  private mapMes(input: AwsSesEvent): string {
    return new Date(input.Records[0].ses.mail.timestamp).toLocaleString(
      'default',
      { month: 'long' },
    );
  }

  private mapRetrasado(input: AwsSesEvent): boolean {
    return input.Records[0].ses.receipt.processingTimeMillis > 1000;
  }

  private mapEmisor(input: AwsSesEvent): string {
    return input.Records[0].ses.mail.source.split('@')[0];
  }

  private mapReceptor(input: AwsSesEvent): string[] {
    return (
      input.Records[0].ses.mail.destination.map(
        (email: string) => email.split('@')[0],
      ) || []
    );
  }

}