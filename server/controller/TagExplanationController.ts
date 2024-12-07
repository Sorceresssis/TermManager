import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ResponseResult } from '../pojo/response-result';
import injectType from '../provider/inject-type';
import type TagExplanationService from '../service/TagExplanationService';
import type TagService from '../service/TagService';

@injectable()
export class TagExplanationController {
  constructor(
    @inject(injectType.TagService) private tagService: TagService,
    @inject(injectType.TagExplanationService) private tagExplanationService: TagExplanationService
  ) { }


  public async HandleitemIndexMiss(req: Request<API.HandleitemIndexMissParamsP>, res: Response) {
    const tagId = Number.parseInt(req.params.id, 10);

    const tag = this.tagService.queryTagById(tagId);
    if (!tag) {
      res.send(ResponseResult.error('tag not found'));
      return;
    }

    await this.tagExplanationService.writeTagExplanationIndexFrame(tag);
    res.redirect(req.originalUrl);
  };
}
