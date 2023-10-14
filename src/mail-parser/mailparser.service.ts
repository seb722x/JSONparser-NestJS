import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { simpleParser, ParsedMail } from 'mailparser';
import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { JsonAttachment } from './interfaces/JsonAttached.inerface';

@Injectable()
export class MailparserService {
  private readonly logger = new Logger('MailParserService');

  async parseEmailAttached(fileName: string) {
    try {
      const emlContent = this.getEmailContent(fileName);
      return await this.parsedEmail(emlContent);
    } catch (error) {
      const message = 'Error processing e-mail, check logs';
      this.handleErrors(error, message);
    }
  }

  private getEmailContent(fileName: string) {
    try {
      const fileRoute = path.join(process.cwd(), 'emails', fileName);
      return fs.readFileSync(fileRoute, 'utf-8');
    } catch (error) {
      const message = 'Error processing route to email, check server logs';
      this.handleErrors(error, message);
    }
  }

  async parsedEmail(emlContent: string): Promise<any> {
    const parsedMail: ParsedMail = await simpleParser(emlContent);
    if (!parsedMail) {
      throw new Error('Error parsing email');
    }
    try {
      if (parsedMail.attachments.length > 0) {
        const jsonAttachment = parsedMail.attachments.find(
          (attachment) => attachment.contentType === 'application/json',
        );
        const jsonData = await this.jsonParse(jsonAttachment);
        return jsonData;
      } else {
        const JsonData = await this.isLinkInBody(parsedMail);
        return JsonData;
      }
    } catch (error) {
      const message = 'Error retrieving JSON data';
      this.handleErrors(error, message);
    }
  }

  async jsonParse(jsonAttachment: JsonAttachment) {
    try {
      const JSONString = jsonAttachment.content.toString('utf-8');
      const JSONData = JSON.parse(JSONString);

      return JSONData;
    } catch (error) {
      const message = 'Error parsing Json to string';
      this.handleErrors(error, message);
    }
  }

  async isLinkInBody(parsedMail:ParsedMail): Promise<any> {
    try {
      const body: any = parsedMail.html || parsedMail.text;
      const links = [];

      const linkRegex = /<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
      let match;
      while ((match = linkRegex.exec(body))) {
        links.push(match[1]);
      }

      const directDownloadLinks = links.filter((link) =>
        this.isDirectDownloadLink(link),
      );
      if (directDownloadLinks.length > 0) {
        const JSONData =await this.scanDirectLinks(directDownloadLinks);
        return JSONData
      } else {
        const webLink = await this.getWebLinksDownload(links[0]);        
        const JSONData = await this.scanDirectLinks(webLink);
        return JSONData;
      }
    } catch (error) {
        const message = 'Error parsing Json to string';
        this.handleErrors(error, message);
    }
  }

  private async  scanDirectLinks(directDownloadLinks: string[]){
    const jsonDataArray = await Promise.all(
      directDownloadLinks.map((link) => this.getDataFromURL(link)),
    );
    if (jsonDataArray.length === 1) {
      return jsonDataArray[0];
    } else {
      return jsonDataArray;
    }
  }

  private isDirectDownloadLink(link: string): boolean {
    const commonDownloadKeywords = ['download', 'dl', 'file', 'get', 'id'];
    const commonFileExtensions = ['.zip', '.rar', '.json'];

    if (
      commonDownloadKeywords.some((keyword) =>
        link.toLowerCase().includes(keyword),
      )) {
      return true;
    }

    if (
      commonFileExtensions.some((extension) =>
        link.toLowerCase().endsWith(extension),
      )){
      return true;
    }
    return false;
  }

  async getWebLinksDownload(webLink: string) {
    try {
      const response = await axios.get(webLink);
      const $ = cheerio.load(response.data);
      
      const links: string[] = [];
      $('a').each((index, element) => {
        const link = $(element).attr('href');
        if (link) {
          links.push(link);
        }
      });
  
      return links;
    }catch (error) {
      const message = 'Error in web page when looking for download links';
      this.handleErrors(error, message);
      return []; 
    }
  }

  async getDataFromURL(downloadLink: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(downloadLink, {
        responseType: 'json',
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      } else {
        const message = 'Error getting JSON data from URL';
        this.handleErrors(error, message);
      }
    }
  }

  private  handleAxiosError(error: any): void {
    this.logger.error('Error processing email link, check logs', error);
    if (error.response) {
      this.logger.error(`${'Server status:'},${error.response.status} `);
      throw new Error(
        'Error  fetchLink. Status Code: ' + error.response.status,
      );
    } else if (error.request) {
      this.logger.error(`${'There is not server response'}`);
      throw new Error('Error  fetchLink. There is not server response');
    } else {
      this.logger.error(`${'Error configuring request'}` + error.message);
      throw new Error('Error en fetchLink. Details: ' + error.message);
    }
  }

  private handleErrors(error: any, customMessage: string): void {
    this.logger.error(`${customMessage} => ${error}`);
    error;
    let statusCode = 500;
    statusCode = error.response.status;
    switch (statusCode) {
      case 400:
        throw new BadRequestException('Bad Request: ' + customMessage);
      case 401:
        throw new UnauthorizedException('Unauthorized: ' + customMessage);
      case 404:
        throw new NotFoundException('Not Found: ' + customMessage);
      default:
        throw new InternalServerErrorException(
          'Internal Server Error: ' + customMessage,
        );
    }
  }
}
