import {
    Controller,
    Post,
    Body,
  } from '@nestjs/common';
  import { JsonMapperService } from './json-mapper.service';
  import { MappedResponse } from 'src/model/mapped-response.model';
  
  @Controller('json-mapper')
  export class JsonMapperController {
    constructor(private readonly jsonMapperService: JsonMapperService) {}
  
    @Post('map-data')
     mapData(@Body() jsonData: any): MappedResponse {
      
        const result: MappedResponse =  this.jsonMapperService.mapToMappedData(jsonData);
        return result;
     
     
    }
  }