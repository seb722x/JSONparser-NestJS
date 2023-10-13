import { Module } from '@nestjs/common';
import { MailparserService } from './mailparser.service';
import { MailparserController } from './mailparser.controller';

@Module({
  controllers: [MailparserController],
  providers: [MailparserService],
})
export class MailparserModule {}