import nodePath from 'node:path';

import type { Request, Response } from 'express';
import { injectable } from 'inversify';

import config from '../config';
import { ResponseResult } from '../dto/ResponseResults';

@injectable()
export class OpenInVscodeController {

  public dataFolder(req: Request, res: Response) {
    res.redirect(`vscode://file/${config.dataDir}`);
  }

  public tagExplanationFile(req: Request, res: Response) {
    const id = req.query.id;
    if (id) {
      res.redirect(`vscode://file/${nodePath.join(config.tagExplanationDir, `${id}.md`)}`);
    } else {
      res.send(ResponseResult.error('id is required'));
    }
  }
}