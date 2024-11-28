import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ResponseResult } from '../dto/ResponseResults';
import injectType from '../provider/injectType';
import type TagExplanationService from '../service/TagExplanationService';
import type TagService from '../service/TagService';

@injectable()
export class TagExplanationController {
  constructor(
    @inject(injectType.TagService) private tagService: TagService,
    @inject(injectType.TagExplanationService) private tagExplanationService: TagExplanationService
  ) { }


  public notExistHandler(req: Request, res: Response) {
    const filename = req.params.filename;

    if (!filename) {
      res.send(ResponseResult.error('params error: filename is required'));
      return;
    }

    const filenameRegex = /^[0-9]+\.md$/;
    if (!filenameRegex.test(filename)) {
      res.send(ResponseResult.error('params error: filename is invalid'));
      return;
    }

    const tagId = Number(filename.split('.')[0]);
    const tag = this.tagService.queryTagById(tagId);

    if (!tag) {
      res.send(ResponseResult.error('tag not found'));
      return;
    }

    // 在本地创建一个filename的文件，然后返回给客户端
    this.tagExplanationService.writeTagExplanationFrame(tag);
    res.redirect(`/tag/${filename}`);
  };
}
