import type { Request, Response } from 'express';
import { injectable } from 'inversify';

import ResourcePath from '@/config/resource-path';
import { ResponseResult } from '@/pojo/response-result';

@injectable()
export class OpenInVscodeController {

  public dataFolder(req: Request, res: Response) {
    res.redirect(`vscode://file/${ResourcePath.DATA_DIR }`);
  }

  public tagExplanationFile(req: Request, res: Response) {
    const id = req.query.id;
    if (id) {
      res.redirect(`vscode://file/${ResourcePath.getTagExplanationItemIndexFile(Number(id))}`);
    } else {
      res.send(ResponseResult.error('id is required'));
    }
  }
}