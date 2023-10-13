import { Controller, Get, Post } from '@nestjs/common';


@Controller()
export class AppController {
  

  @Post('/static-host')
  index() {}
}

