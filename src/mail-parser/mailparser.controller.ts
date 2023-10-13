import { Controller, Get, Body } from '@nestjs/common';
import { MailparserService } from './mailparser.service';
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBodyOptions,
} from '@nestjs/swagger';

@Controller('email')
export class MailparserController {
  constructor(private readonly mailParserService: MailparserService) {}

  @Get()
  test() {
    return 'testing';
  }

  @Get('parse-json')
  @ApiOperation({
    summary: 'Parser JSON data from the attachement of the file to an email',
  })
  @ApiBody(<ApiBodyOptions>{
    type: String,
    description: 'Name email file',
    example: { mail: 'test.eml' },
  })
  @ApiResponse({ status: 200, description: 'JSON Data retrieve ' })
  async getJsonFromEmail(@Body() fileName: any): Promise<any> {
    return await this.mailParserService.parseEmailAttached(fileName.mail);
  }
}
