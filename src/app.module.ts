import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { JsonMapperModule } from './json-mapper/json-mapper.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailparserModule } from './mail-parser/mailparser.module';

@Module({
  imports: [
    JsonMapperModule,
    MailparserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
