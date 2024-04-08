import { All, Controller,  Next, Req, Res } from '@nestjs/common';
import { createRequestHandler } from '@remix-run/express';
import { NextFunction, Request, Response } from 'express';
import { getServerBuild } from '@monolith/frontend';
import { RemixService } from './remix.service';


@Controller()
export class RemixController {
  constructor(private readonly remixService: RemixService) {}

  @All("*")
  async handler(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
return createRequestHandler({
    build: await getServerBuild(),
    getLoadContext: () => ({
        remixService: this.remixService
    })
})
  }
}
